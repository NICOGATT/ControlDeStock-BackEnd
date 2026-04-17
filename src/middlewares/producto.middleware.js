const { Producto } = require("../../db/models");
const { productoSchema, productoUpdateSchema } = require("../schemas/producto.schema");
const genericValidations = require("./genericValidations");

const validateProductoSchema = genericValidations.validateSchema(productoSchema);
const validateProductoUpdateSchema = genericValidations.validateSchema(productoUpdateSchema);
const validateProductoById = genericValidations.validateModelById(Producto);
const validateProductoName = genericValidations.validateModelName(Producto);
const validateProductoByName = genericValidations.validateModelByParam(Producto, "nombre");
const validateProductoByCodigoBarras = genericValidations.validateModelByParam(Producto, "codigoBarras");
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

const validateProductId = async (req, res, next) => {
  const { id } = req.body;
  console.log("Validando ID del producto:", id);
  const producto = await Producto.findByPk(id);
  if (producto) {
    return res.status(404).json({ message: `Ya existe un producto con el ID: ${id}. ` });
  }
  next();
}

module.exports = {
  validateProductoSchema,
  validateProductoUpdateSchema,
  validateProductoById,
  validateProductoName,
  validateProductoByName,
  validateProductoByIdBody,
  validateProductId,
  validateProductoByCodigoBarras
};
