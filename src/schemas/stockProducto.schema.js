const joi = require('joi');

const numberSchema = joi.number().integer().min(0).required().messages({
  'number.base': 'La cantidad debe ser un número',
  'number.integer': 'La cantidad debe ser un número entero',
  'number.min': 'La cantidad debe ser al menos 0',
  'any.required': 'La cantidad es requerida',
});

const colorYTalleSchema = joi.object({
  colorId: numberSchema.min(1).messages({
    'number.min': 'El colorId debe ser al menos 1',
  }),
  talleId: numberSchema.min(1).messages({
    'number.min': 'El talleId debe ser al menos 1',
  }),
  cantidad: numberSchema,
});

const createStockProductoSchema = joi.object({
  coloresYTalles: joi
    .array()
    .items(colorYTalleSchema)
    .min(1)
    .required()
    .custom((value, helpers) => {
      const seen = new Set();
      for (const item of value) {
        const key = `${item.colorId}-${item.talleId}`;
        if (seen.has(key)) {
          return helpers.error("array.unique", { key });
        }
        seen.add(key);
      }
      return value;
    })
    .messages({
      'array.base': 'coloresYTalles debe ser un arreglo',
      'array.min': 'coloresYTalles debe tener al menos 1 elemento',
      'any.required': 'coloresYTalles es obligatorio',
      'array.unique': 'Los elementos de coloresYTalles deben ser únicos por colorId y talleId',
    }),
  productoId: numberSchema,
});

module.exports = { createStockProductoSchema, colorYTalleSchema };