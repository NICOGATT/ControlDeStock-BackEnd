const joi = require("joi");

const productoIdSchema = joi.object({
  productoId: joi.number().integer().required().messages({
    "number.base": "El campo productoId debe ser un número entero.",
    "any.required": "El campo productoId es obligatorio.",
  }),
});

const productoSchema = joi.object({
  ...productoIdSchema.describe().keys,
  cantidad: joi.number().integer().min(1).required().messages({
    "number.base": "El campo cantidad debe ser un número entero.",
    "any.required": "El campo cantidad es obligatorio.",
    "number.min": "El campo cantidad debe ser al menos 1.",
  }),
});

const preFacturaProductoSchema = joi.object({
  productos: joi.array().items(productoSchema).unique("productoId").required().messages({
    "array.base": "El campo productos debe ser un arreglo.",
    "any.required": "El campo productos es obligatorio.",
    "array.unique": "No se pueden repetir productos en una misma prefactura",
  }),
  preFacturaId: joi.number().integer().required().messages({
    "number.base": "El campo preFacturaId debe ser un número entero.",
    "any.required": "El campo preFacturaId es obligatorio.",
  }),
});

const preFacturaProductoDeleteSchema = joi.object({
  productos: joi.array().items(productoIdSchema).unique("productoId").required().messages({
    "array.base": "El campo productos debe ser un arreglo.",
    "any.required": "El campo productos es obligatorio.",
    "array.unique": "No se pueden repetir productos en una misma prefactura",
  }),
  preFacturaId: joi.number().integer().required().messages({
    "number.base": "El campo preFacturaId debe ser un número entero.",
    "any.required": "El campo preFacturaId es obligatorio.",
  }),
});

module.exports = { preFacturaProductoSchema, preFacturaProductoDeleteSchema };
