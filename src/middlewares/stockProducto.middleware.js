const {
  createStockProductoSchema,
  updateStockProductoSchema,
} = require("../schemas/stockProducto.schema");
const genericValidations = require("./genericValidations");
const { StockProducto, Producto, Color, Talle, PreFacturaProducto } = require("../../db/models");

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

  for (const colorYTalle of coloresYTalles) {
    const { color, talle, cantidad } = colorYTalle;
    const product = await Producto.findByPk(productoId);
    const colorInstance = await Color.findOne({ where: { nombre: color } });
    const talleInstance = await Talle.findOne({ where: { nombre: talle } });
    const stockProducto = await StockProducto.findOne({
      where: {
        productoId,
        colorId: colorInstance.id,
        talleId: talleInstance.id,
      },
    });

    if (stockProducto && stockProducto.stock < cantidad) {
      return res.status(400).json({
        message: `No hay stock suficiente: de ${product.nombre}, de color ${color.nombre} y talle ${talle.nombre}, el stock actual es ${stockProducto.stock} y se requiere ${cantidad}`,
      });
    }
  }
  next();
};

const validateStockProductoExistsByIds = async (req, res, next) => {
  const { productos } = req.body;

  for (const producto of productos) {
    const product = await Producto.findByPk(producto.productoId);
    const color = await Color.findByPk(producto.colorId);
    const talle = await Talle.findByPk(producto.talleId);
    const error = `No se encontró stock asociado al producto: ${product.nombre}, de color ${color.nombre} y talle ${talle.nombre}`
    if (!color || !talle) {
      return res.status(404).json({
        message: error
      });
    }
    const stockProducto = await StockProducto.findOne({
      where: {
        productoId: producto.productoId,
        colorId: producto.colorId,
        talleId: producto.talleId,
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

module.exports = {
  validateStockProductoSchema,
  validateUpdateStockProductoSchema,
  validateStockProductoExists,
  validateStockProductoNonExists,
  validateStockProductoQuantity,
  validateStockProductoExistsByIds
};
