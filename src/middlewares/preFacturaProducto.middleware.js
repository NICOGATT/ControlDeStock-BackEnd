const { preFacturaProductoSchema, preFacturaProductoDeleteSchema } = require("../schemas/preFacturaProducto.schema");
const { Producto, PreFacturaProducto, Talle, Color } = require("../../db/models");
const genericValidator = require("../middlewares/genericValidations");

const validatePreFacturaProductoSchema =genericValidator.validateSchema(preFacturaProductoSchema);

const validatePreFacturaProductoDeleteSchema =genericValidator.validateSchema(preFacturaProductoDeleteSchema);

const validatePreFacturaProductoExistence = async (req,res,next) => {
  const { productos, preFacturaId } = req.body;
  
  for (const elemento of productos) {
    const { productoId, talleId, colorId } = elemento;
    const producto = await Producto.findByPk(productoId);
    const color = await Color.findByPk(colorId);
    const talle = await Talle.findByPk(talleId);
    const preFacturaProducto = await PreFacturaProducto.findOne({
      where: { productoId, preFacturaId, talleId, colorId },
    });
    if (!preFacturaProducto) {
      return res.status(400).json({
        message: `El producto ${producto.nombre} de color ${color.nombre} y talle ${talle.nombre} no esta asociado a la prefactura.`,
      });
    }
  }
  next();
};

const validatePreFacturaProductoNonExistence = async (req,res,next) => {
  const { productos, preFacturaId } = req.body;
  
  for (const elemento of productos) {
    const { productoId, colorId, talleId } = elemento;
    const producto = await Producto.findByPk(productoId);
    const color = await Color.findByPk(colorId);
    const talle = await Talle.findByPk(talleId);
    const preFacturaProducto = await PreFacturaProducto.findOne({
      where: { productoId, preFacturaId, colorId, talleId },
    });
    if (preFacturaProducto) {
      return res.status(400).json({
        message: `El producto ${producto.nombre} de color ${color.nombre} y talle ${talle.nombre} ya esta asociado a la prefactura.`,
      });
    }
  }
  next();
};

module.exports = {
  validatePreFacturaProductoSchema,
  validatePreFacturaProductoDeleteSchema,
  validatePreFacturaProductoExistence,
  validatePreFacturaProductoNonExistence
};