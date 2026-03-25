const joi = require("joi");
const { idSchema } = require('./producto.schema');

const numberSchema = joi.number().integer().min(1).optional().messages({
    "number.base": "{#label} cantidad debe ser un número entero.",
    "number.integer": "{#label} cantidad debe ser un número entero.",
    "number.min": "{#label} cantidad debe ser al menos 1.",
    "any.required": "{#label} cantidad es un campo obligatorio.",
  })

const productoSchema = joi.object({
  productoId: idSchema,
  talleId: numberSchema.label("talleId").required(),
  colorId: numberSchema.label("colorId").required(),
  cantidad: numberSchema
});

const productoDeleteSchema = joi.object({
  productoId: idSchema,
  talleId: numberSchema.label("talleId").required(),
  colorId: numberSchema.label("colorId").required()
});

const preFacturaProductoSchema = joi.object({
  productos: joi.array().items(productoSchema).unique((a, b) => 
    a.productoId === b.productoId && 
    a.talleId === b.talleId && 
    a.colorId === b.colorId && 
    a.cantidad === b.cantidad
  ).required().messages({
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
  productos: joi.array().items(productoDeleteSchema).unique((a, b) => 
    a.productoId === b.productoId && 
    a.talleId === b.talleId && 
    a.colorId === b.colorId
  ).required().messages({
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
