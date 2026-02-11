const joi = require("joi");

const productoSchema = joi.object({
  productoId: joi.number().integer().required().messages({
    "number.base": "El campo productoId debe ser un número entero.",
    "any.required": "El campo productoId es obligatorio.",
  }),
  cantidad: joi.number().integer().min(1).required().messages({
    "number.base": "El campo cantidad debe ser un número entero.",
    "any.required": "El campo cantidad es obligatorio.",
    "number.min": "El campo cantidad debe ser al menos 1.",
  }),
});

const preFacturaProductoSchema = joi.object({
  productos: joi.array().items(productoSchema).required(),
  preFacturaId: joi.number().integer().required().messages({
    "number.base": "El campo preFacturaId debe ser un número entero.",
    "any.required": "El campo preFacturaId es obligatorio.",
  })
});

module.exports = { preFacturaProductoSchema };
