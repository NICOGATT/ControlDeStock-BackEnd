const joi = require("joi");

const dateSchema = joi.object({
  fecha: joi.date().iso().required().messages({
    "date.base": "La fecha debe ser una fecha válida",
    "any.required": "La fecha es obligatoria",
    "date.iso": "La fecha debe estar en formato ISO (YYYY-MM-DD)",
  }),
});

const preFacturaSchema = joi.object({
  cliente: joi.string().min(3).max(100).required().messages({
    "string.base": "El cliente debe ser una cadena de texto",
    "string.empty": "El cliente es obligatorio",
    "string.min": "El cliente debe tener al menos 3 caracteres",
    "string.max": "El cliente no debe exceder los 100 caracteres",
    "any.required": "El cliente es obligatorio",
  }),
  telefono: joi.string().pattern(/^\d{10}$/).required().messages({
    "string.base": "El teléfono debe ser una cadena de texto",
    "string.empty": "El teléfono es obligatorio",
    "string.pattern.base": "El teléfono debe tener exactamente 10 dígitos",
    "any.required": "El teléfono es obligatorio",
  }),
  direccion: joi.string().min(5).max(200).required().messages({
    "string.base": "La dirección debe ser una cadena de texto",
    "string.empty": "La dirección es obligatoria",
    "string.min": "La dirección debe tener al menos 5 caracteres",
    "string.max": "La dirección no debe exceder los 200 caracteres",
    "any.required": "La dirección es obligatoria", 
  })
});

module.exports = { preFacturaSchema, dateSchema };
