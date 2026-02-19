const { StockProducto, Producto, Talle, Color } = require('../../db/models');

const resBody = async (productoId) => await StockProducto.findAll({
  where: { productoId },
  attributes: [ 'stock'],
  include: [
    { model: Producto, as: 'producto', attributes: ['id', 'nombre'] },
    { model: Color, as: 'color', attributes: ['id', 'nombre'] },
    { model: Talle, as: 'talle', attributes: ['id', 'nombre'] },
  ],
});

//1. Crear stock de producto
const createStockProducto = async (req, res) => {
  const { productoId, coloresYTalles } = req.body;

  const promises = coloresYTalles.map(async (item) => {
    const { color, talle, cantidad } = item;
    const colorInstance = await Color.findOrCreate({ where: { nombre: color } });
    const talleInstance = await Talle.findOrCreate({ where: { nombre: talle } });
    await StockProducto.create({
      productoId,
      colorId: colorInstance[0].id,
      talleId: talleInstance[0].id,
      stock: cantidad,
    });
  });

  await Promise.all(promises);

  const stockProductos = await resBody(productoId);

  return res.status(201).json(stockProductos);
}


//2. Actualizar stock de producto por id
const updateStockProducto = async (req, res) => {
  const { productoId, coloresYTalles } = req.body;

  const promises = coloresYTalles.map(async (item) => {
    const { color, talle, cantidad } = item;
    const colorInstance = await Color.findOrCreate({ where: { nombre: color } });
    const talleInstance = await Talle.findOrCreate({ where: { nombre: talle } });
    await StockProducto.update(
      { stock: cantidad },
      {
        where: {
          productoId,
          colorId: colorInstance[0].id,
          talleId: talleInstance[0].id,
        },
      }
    );
  });

  await Promise.all(promises);

  const stockProductos = await resBody(productoId);

  return res.status(200).json(stockProductos);
}

//3. Eliminar stock de producto por id
const deleteStockProducto = async (req, res) => {
  const { productoId, coloresYTalles } = req.body;

  const promises = coloresYTalles.map(async (item) => {
    const { color, talle } = item;
    const colorInstance = await Color.findOrCreate({ where: { nombre: color } });
    const talleInstance = await Talle.findOrCreate({ where: { nombre: talle } });
    await StockProducto.destroy({
      where: {
        productoId,
        colorId: colorInstance[0].id,
        talleId: talleInstance[0].id,
      }
    });
  });

  await Promise.all(promises);

  return res.status(204).send();
}

//4. Obtener todos los stocks de productos
const getAllStockProductos = async (_, res) => {
  const stockProductos = await StockProducto.findAll({
    attributes: [ 'stock'],
    include: [
      { model: Producto, as: 'producto', attributes: ['id', 'nombre'] },
      { model: Color, as: 'color', attributes: ['id', 'nombre'] },
      { model: Talle, as: 'talle', attributes: ['id', 'nombre'] },
    ],
  });
  return res.status(200).json(stockProductos);
}

//5. Obtener stock de producto por id
const getStockProductoByProductoId = async (req, res) => {
  const { productoId } = req.params;
  const stockProductos = await resBody(productoId);

  return res.status(200).json(stockProductos);
}

module.exports = {
  createStockProducto,
  updateStockProducto,
  deleteStockProducto,
  getAllStockProductos,
  getStockProductoByProductoId,
}