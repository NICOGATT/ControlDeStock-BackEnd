const {
  createStockProductoSchema,
} = require("../schemas/stockProducto.schema");
const genericValidations = require("./genericValidations");
const { StockProducto, Producto, Color, Talle } = require("../../db/models");

const validateStockProductoSchema = genericValidations.validateSchema(
  createStockProductoSchema,
);

const validateStockProductoExists = async (req, res, next) => {
  const { productoId, coloresYTalles } = req.body;
  const producto = await Producto.findByPk(productoId);

  for (const item of coloresYTalles) {
    const { colorId, talleId } = item;
    const color = await Color.findByPk(colorId);
    const talle = await Talle.findByPk(talleId);
    const stockProducto = await StockProducto.findOne({
      where: { productoId, colorId, talleId },
    });

    if (!stockProducto) {
      return res.status(404).json({
          error: `No se encontró stock del producto: ${producto.nombre}, de color ${color.nombre} y talle ${talle.nombre}`,
        });
    }
  }
  next();
};

const validateStockProductoQuantity = async (req, res, next) => {
  const { productoId, coloresYTalles } = req.body;
  const producto = await Producto.findByPk(productoId);

  for (const item of coloresYTalles) {
    const { colorId, talleId } = item;
    const color = await Color.findByPk(colorId);
    const talle = await Talle.findByPk(talleId);
    const stockProducto = await StockProducto.findOne({
      where: { productoId, colorId, talleId },
    });

    if (stockProducto && stockProducto.cantidad < item.cantidad) {
      return res.status(404).json({
          error: `No hay stock suficiente: de ${producto.nombre}, de color ${color.nombre} y talle ${talle.nombre}, el stock actual es ${stockProducto.cantidad} y se requiere ${item.cantidad}`,
        });
    }
  }
  next();
};

module.exports = {
  validateStockProductoSchema,
  validateStockProductoExists,
  validateStockProductoQuantity,
};
