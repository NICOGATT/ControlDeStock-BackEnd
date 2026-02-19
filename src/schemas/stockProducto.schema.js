const joi = require('joi');
const { colorYTalleSchema } = require('./producto.schema');

const numberSchema = joi.number().integer().min(0).required().messages({
  'number.base': 'La cantidad debe ser un número',
  'number.integer': 'La cantidad debe ser un número entero',
  'number.min': 'La cantidad debe ser al menos 0',
  'any.required': 'La cantidad es requerida',
});

const arrayOfColorYTalleSchema = (schema) => joi.array().items(schema).min(1).required()
  .custom((value, helpers) => {
      const seen = new Set();
      for (const item of value) {
        const key = `${item.color}-${item.talle}`;
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
      'array.unique': 'No se permiten combinaciones repetidas de color y talle',
    });


const createStockProductoSchema = joi.object({
  coloresYTalles: arrayOfColorYTalleSchema(colorYTalleSchema),
  productoId: numberSchema,
});

const updateColorYTalleSchema = joi.object({
  color: joi.string().min(1).required().messages({
    'string.base': 'El color debe ser una cadena de texto',
    'any.required': 'El color es requerido',
    "string.min": 'El color no puede estar vacío',
  }),
  talle: joi.string().min(1).required().messages({
    'string.base': 'El color debe ser una cadena de texto',
    'any.required': 'El color es requerido',
    "string.min": 'El color no puede estar vacío',
  })
});

const updateStockProductoSchema = joi.object({
  coloresYTalles: arrayOfColorYTalleSchema(colorYTalleSchema),
  productoId: numberSchema,
});

module.exports = { createStockProductoSchema, colorYTalleSchema, updateStockProductoSchema };