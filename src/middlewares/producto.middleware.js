const { Producto } = require("../../db/models");
const { productoSchema, productoUpdateSchema } = require("../schemas/producto.schema");
const genericValidations = require("./genericValidations");

const validateProductoSchema = genericValidations.validateSchema(productoSchema);
const validateProductoUpdateSchema = genericValidations.validateSchema(productoUpdateSchema);
const validateProductoById = genericValidations.validateModelById(Producto);
const validateProductoName = genericValidations.validateModelName(Producto);
const validateProductoByName = genericValidations.validateModelByParam(Producto, "nombre");

module.exports = {
  validateProductoSchema,
  validateProductoUpdateSchema,
  validateProductoById,
  validateProductoName,
  validateProductoByName
};
