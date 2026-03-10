const { Producto, Color, Talle, TipoDePrenda, StockProducto } = require("../../db/models");
const genericControllers = require("./generic.controller");

//1. Crear un nuevo producto
const crearStock = async (modeloColor, valorColor, modeloTalle, valorTalle, productoId, stock, precio) => {
  const color = await modeloColor.findOrCreate({ where: { nombre: valorColor } });
  const talle = await modeloTalle.findOrCreate({ where: { nombre: valorTalle } });
  await StockProducto.create({
    productoId,
    colorId: color[0].id, 
    talleId: talle[0].id, 
    stock: stock,
    precio: precio,
  });
};

const createProducto = async (req, res) => {
  const { colorYTalle, nombre, id } = req.body;
  const newProducto = await Producto.create({
    id,
    nombre,
  });

  const promesas = colorYTalle.map(async (item) => {
    await crearStock(Color, item.color, Talle, item.talle, newProducto.id, item.cantidad, item.precio);
  });

  await Promise.all(promesas);

  await TipoDePrenda.findOrCreate({ 
    where: { nombre: req.body.tipoDePrenda } 
  }).then(([tipo]) => newProducto.setTipoDePrenda(tipo));

  const responseProducto = await Producto.findByPk(newProducto.id, {
      include: [
        {
          model: StockProducto,
          as: "stockProductos",
          attributes: ["stock", "precio"],
          include: [
            { model: Color, as: "color", attributes: ["nombre"] },
            { model: Talle, as: "talle", attributes: ["nombre"] },
          ],
        },
        { model: TipoDePrenda, as: "tipoDePrenda" },
      ],
    })

  return res.status(201).json(responseProducto);
};

//2. Actualizar un producto por su ID
const updateProducto = async (req, res) => {
  const { id } = req.params;
  const { nombre, tipoDePrenda } = req.body;
  const producto = await Producto.findByPk(id);
  
  if (tipoDePrenda){
    const prenda = await TipoDePrenda.findOrCreate({ where: { nombre: tipoDePrenda } });
    await producto.setTipoDePrenda(prenda[0]);
  }
  
  await Producto.update({ 
    nombre
  }, 
    { where: { id } }
  );

  const responseProducto = await Producto.findByPk(id, {
    attributes: ["id", "nombre"],
    include: [
      { model: TipoDePrenda, as: "tipoDePrenda" },
    ],
  })

  return res.status(200).json(responseProducto);
};

//3. Eliminar un producto por su ID
const deleteModel = genericControllers.deleteModel(Producto);

//4. Obtener todos los productos
const getAllProductos = async (_, res) => {
  const productos = await Producto.findAll({
    attributes: ["id", "nombre"],
    include: [
      {
        model: StockProducto,
        as: "stockProductos",
        attributes: ["stock", "precio"],
        include: [
          { model: Color, as: "color", attributes: ["nombre"] },
          { model: Talle, as: "talle", attributes: ["nombre"] },
        ],
      },
      { model: TipoDePrenda, as: "tipoDePrenda" },
    ],
  });
  return res.status(200).json(productos);
};

//5. Obtener un producto por su ID
const getProductoById = async (req, res) => {
  const { id } = req.params;
  const producto = await Producto.findByPk(id, {
    attributes: ["id", "nombre"],
    include: [
      {
        model: StockProducto,
        as: "stockProductos",
        attributes: ["stock", "precio"],
        include: [
          { model: Color, as: "color", attributes: ["nombre"] },
          { model: Talle, as: "talle", attributes: ["nombre"] },
        ],
      },
      { model: TipoDePrenda, as: "tipoDePrenda" },
    ],
  });
  return res.status(200).json(producto);
};

//6. Buscar productos por nombre
const getProductoByName = async (req, res) => {
  const { nombre } = req.params;
  const producto = await Producto.findOne({
    where: { nombre },
    attributes: ["id", "nombre"],
    include: [
      {
        model: StockProducto,
        as: "stockProductos",
        attributes: ["stock", "precio"],
        include: [
          { model: Color, as: "color", attributes: ["nombre"] },
          { model: Talle, as: "talle", attributes: ["nombre"] },
        ],
      },
      { model: TipoDePrenda, as: "tipoDePrenda" },
    ],
  });
  return res.status(200).json(producto);
};

module.exports = {
  createProducto,
  updateProducto,
  deleteModel,
  getAllProductos,
  getProductoById,
  getProductoByName,
};
