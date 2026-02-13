const { StockProducto, Producto, Talle, Color } = require('../../db/models');
const genericController = require('./generic.controller');

//1. Crear stock de producto
const createStockProducto = async (req, res) => {
  const { productoId, coloresYTalles } = req.body;

  coloresYTalles.map(async (item) => {
    const { colorId, talleId, cantidad } = item;
    await StockProducto.findOrCreate({
      where: {
        productoId,
        colorId,
        talleId,
      },
      defaults: {
        cantidad,
      }
    });
  });

  await Promise.all(coloresYTalles);

  return res.status(201).json(await StockProducto.findAll({
    where: { productoId },
    include: [
      { model: Producto, as: 'producto' },
      { model: Color, as: 'color' },
      { model: Talle, as: 'talle' },
    ],
  }));
}

//2. Actualizar stock de producto por id
const updateStockProducto = async (req, res) => {
  const { productoId, coloresYTalles } = req.body;

  coloresYTalles.map(async (item) => {
    const { colorId, talleId, cantidad } = item;
    const stockProducto = await StockProducto.findOne({
      where: {
        productoId,
        colorId,
        talleId,
      }
    });
    await stockProducto.update({ stock: cantidad - stockProducto.stock });
  });

  await Promise.all(coloresYTalles);

  return res.status(201).json(await StockProducto.findAll({
    where: { productoId },
    include: [
      { model: Producto, as: 'producto' },
      { model: Color, as: 'color' },
      { model: Talle, as: 'talle' },
    ],
  }));
}

//3. Eliminar stock de producto por id
const deleteStockProducto = async (req, res) => {
  const { productoId, coloresYTalles } = req.body;

  coloresYTalles.map(async (item) => {
    const { colorId, talleId } = item;
    await StockProducto.destroy({
      where: {
        productoId,
        colorId,
        talleId,
      }
    });
  });

  await Promise.all(coloresYTalles);

  return res.status(201).json(await StockProducto.findAll({
    where: { productoId },
    include: [
      { model: Producto, as: 'producto' },
      { model: Color, as: 'color' },
      { model: Talle, as: 'talle' },
    ],
  }));
}

//4. Obtener todos los stocks de productos
const getAllStockProductos = async (req, res) => {
  const stockProductos = await StockProducto.findAll({
    include: [
      { model: Producto, as: 'producto' },
      { model: Color, as: 'color' },
      { model: Talle, as: 'talle' },
    ],
  });
  return res.status(200).json(stockProductos);
}

//5. Obtener stock de producto por id
const getStockProductoByProductoId = async (req, res) => {
  const { productoId } = req.params;
  const stockProducto = await StockProducto.findAll(productoId, {
    include: [
      { model: Producto, as: 'producto' },
      { model: Color, as: 'color' },
      { model: Talle, as: 'talle' },
    ],
  });
  return res.status(200).json(stockProducto);
}

module.exports = {
  createStockProducto,
  updateStockProducto,
  deleteStockProducto,
  getAllStockProductos,
  getStockProductoByProductoId,
}