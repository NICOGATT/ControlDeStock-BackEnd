const { Producto } = require("../../db/models");
const { productoSchema, productoUpdateSchema } = require("../schemas/producto.schema");
const genericValidations = require("./genericValidations");

const validateProductoSchema = genericValidations.validateSchema(productoSchema);
const validateProductoUpdateSchema = genericValidations.validateSchema(productoUpdateSchema);
const validateProductoById = genericValidations.validateModelById(Producto);
const validateProductoName = genericValidations.validateModelName(Producto);
const validateProductoByName = genericValidations.validateModelByParam(Producto, "nombre");
const validateProductoByIdBody = async (req, res, next) => {
  const { productoId } = req.body;
  const producto = await Producto.findByPk(productoId);
  if (!producto) {
    return res.status(404).json({
      message: `No se encontró el producto con id ${productoId}`,
    });
  }
  next();
}

module.exports = {
  validateProductoSchema,
  validateProductoUpdateSchema,
  validateProductoById,
  validateProductoName,
  validateProductoByName,
  validateProductoByIdBody
};
