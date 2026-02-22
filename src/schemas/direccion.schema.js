const joi = require('joi');

const direccionSchema = joi.object({
  direccion: joi.string().min(1).required().messages({
    'string.base': 'La dirección debe ser una cadena de texto.',
    'string.empty': 'La dirección no puede estar vacía.',
    'any.required': 'La dirección es un campo obligatorio.'
  }),
  clienteId: joi.number().min(1).integer().required().messages({
    'number.base': 'El ID del cliente debe ser un número.',
    'number.min': 'El ID del cliente debe ser un número positivo.',
    'number.integer': 'El ID del cliente debe ser un número entero.',
    'any.required': 'El ID del cliente es un campo obligatorio.'
  })
});

const direccionUpdateSchema = joi.object({
  direccion: joi.string().min(1).required().messages({
    'string.base': 'La dirección debe ser una cadena de texto.',
    'string.empty': 'La dirección no puede estar vacía.',
    'any.required': 'La dirección es un campo obligatorio.'
  }),
  clienteId: joi.number().min(1).integer().required().messages({
    'number.base': 'El ID del cliente debe ser un número.',
    'number.min': 'El ID del cliente debe ser un número positivo.',
    'number.integer': 'El ID del cliente debe ser un número entero.',
    'any.required': 'El ID del cliente es un campo obligatorio.'
  }),
  direccionNueva: joi.string().min(1).required().messages({
    'string.base': 'La dirección debe ser una cadena de texto.',
    'string.empty': 'La dirección no puede estar vacía.',
    'any.required': 'La dirección es un campo obligatorio.'
  }),
});

module.exports = { direccionSchema, direccionUpdateSchema };