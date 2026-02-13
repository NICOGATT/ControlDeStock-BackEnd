const joi = require('joi');

const numberSchema = joi.number().integer().min(0).required().messages({
  'number.base': 'La cantidad debe ser un número',
  'number.integer': 'La cantidad debe ser un número entero',
  'number.min': 'La cantidad debe ser al menos 0',
  'any.required': 'La cantidad es requerida',
});

const colorYTalleSchema = joi.object({
  colorId: numberSchema,
  talleId: numberSchema,
  cantidad: numberSchema,
});

const createStockProductoSchema = joi.object({
  coloresYTalles: joi.array().items(colorYTalleSchema).min(1).required(),
  productoId: numberSchema,
});

module.exports = { createStockProductoSchema };