const {
  createStockProductoSchema,
  updateStockProductoSchema,
} = require("../schemas/stockProducto.schema");
const genericValidations = require("./genericValidations");
const { StockProducto, Producto, Color, Talle } = require("../../db/models");

const validateStockProductoSchema = genericValidations.validateSchema(
  createStockProductoSchema,
);

const validateUpdateStockProductoSchema = genericValidations.validateSchema(
  updateStockProductoSchema,
);

const validateStockProductoExists = async (req, res, next) => {
  const { productoId, coloresYTalles } = req.body;
  const producto = await Producto.findByPk(productoId);

  for (const item of coloresYTalles) {
    const { color, talle } = item;
    const colorInstance = await Color.findOne({ where: { nombre: color } });
    const talleInstance = await Talle.findOne({ where: { nombre: talle } });
    const error = `No se encontró stock asociado al producto: ${producto.nombre}, de color ${color} y talle ${talle}`
    if (!colorInstance || !talleInstance) {
      return res.status(404).json({
        message: error
      });
    }
    const stockProducto = await StockProducto.findOne({
      where: {
        productoId,
        colorId: colorInstance.id,
        talleId: talleInstance.id,
      },
    });

    if (!stockProducto) {
      return res.status(404).json({
        message: error,
      });
    }
  }
  next();
};

const validateStockProductoNonExists = async (req, res, next) => {
  const { productoId, coloresYTalles } = req.body;
  const producto = await Producto.findByPk(productoId);

  for (const item of coloresYTalles) {
    const { color, talle } = item;
    const colorInstance = await Color.findOne({ where: { nombre: color } });
    const talleInstance = await Talle.findOne({ where: { nombre: talle } });

    if (!colorInstance || !talleInstance) {
      continue; // Si el color o talle no existe, se omite esta combinación y se continúa con la siguiente
    }

    const stockProducto = await StockProducto.findOne({
      where: {
        productoId,
        colorId: colorInstance.id,
        talleId: talleInstance.id,
      },
    });

    if (stockProducto) {
      return res.status(400).json({
        message: `Ya existe stock del producto: ${producto.nombre}, de color ${color} y talle ${talle}`,
      });
    }
  }
  next();
};

const validateStockProductoQuantity = async (req, res, next) => {
  const { productoId, coloresYTalles } = req.body;
  const producto = await Producto.findByPk(productoId);

  for (const item of coloresYTalles) {
    const { color, talle } = item;
    const colorInstance = await Color.findOne({ where: { nombre: color } });
    const talleInstance = await Talle.findOne({ where: { nombre: talle } });
    const stockProducto = await StockProducto.findOne({
      where: {
        productoId,
        colorId: colorInstance.id,
        talleId: talleInstance.id,
      },
    });

    if (stockProducto && stockProducto.stock < item.cantidad) {
      return res.status(400).json({
        message: `No hay stock suficiente: de ${producto.nombre}, de color ${color} y talle ${talle}, el stock actual es ${stockProducto.stock} y se requiere ${item.cantidad}`,
      });
    }
  }
  next();
};

module.exports = {
  validateStockProductoSchema,
  validateUpdateStockProductoSchema,
  validateStockProductoExists,
  validateStockProductoNonExists,
  validateStockProductoQuantity,
};
