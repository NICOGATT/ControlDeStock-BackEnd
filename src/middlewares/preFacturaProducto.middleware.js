const { preFacturaProductoSchema } = require("../schemas/preFacturaProducto.schema");
const { Producto, PreFacturaProducto } = require("../../db/models");
const genericValidator = require("../middlewares/genericValidations");

const validatePreFacturaProductoSchema =genericValidator.validateSchema(preFacturaProductoSchema);

const validateElements = (condicion, mensaje) => async (req,res,next) => {
  const { elementos, preFacturaId } = req.body;
  
  for (const elemento of elementos) {
    const { productoId } = elemento;
    const producto = await Producto.findByPk(productoId);
    const preFacturaProducto = await PreFacturaProducto.findOne({
      where: { productoId, preFacturaId },
    });

    if (preFacturaProducto === condicion) {
      return res.status(400).json({
        error: `El producto ${producto.nombre} ${mensaje}.`,
      });
    }
  }
  next();
};

const validatePreFacturaProductoExistence = validateElements(true, "ya está asociado a la prefactura");

const validatePreFacturaProductoNonExistence = validateElements(false, "no está asociado a la prefactura");

module.exports = {
  validatePreFacturaProductoSchema,
  validatePreFacturaProductoExistence,
  validatePreFacturaProductoNonExistence
};