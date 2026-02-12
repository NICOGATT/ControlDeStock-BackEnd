const { preFacturaProductoSchema, preFacturaProductoDeleteSchema } = require("../schemas/preFacturaProducto.schema");
const { Producto, PreFacturaProducto } = require("../../db/models");
const genericValidator = require("../middlewares/genericValidations");

const validatePreFacturaProductoSchema =genericValidator.validateSchema(preFacturaProductoSchema);

const validatePreFacturaProductoDeleteSchema =genericValidator.validateSchema(preFacturaProductoDeleteSchema);

const validatePreFacturaProductoExistence = async (req,res,next) => {
  const { productos, preFacturaId } = req.body;
  
  for (const elemento of productos) {
    const { productoId } = elemento;
    const producto = await Producto.findByPk(productoId);
    const preFacturaProducto = await PreFacturaProducto.findOne({
      where: { productoId, preFacturaId },
    });
    if (!preFacturaProducto) {
      return res.status(400).json({
        error: `El producto ${producto.nombre} no esta asociado a la prefactura.`,
      });
    }
  }
  next();
};

const validatePreFacturaProductoNonExistence = async (req,res,next) => {
  const { productos, preFacturaId } = req.body;
  
  for (const elemento of productos) {
    const { productoId } = elemento;
    const producto = await Producto.findByPk(productoId);
    const preFacturaProducto = await PreFacturaProducto.findOne({
      where: { productoId, preFacturaId },
    });
    if (preFacturaProducto) {
      return res.status(400).json({
        error: `El producto ${producto.nombre} ya esta asociado a la prefactura.`,
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