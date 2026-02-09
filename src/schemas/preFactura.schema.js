const joi = require("joi");

const dateSchema = joi.object({
  fecha: joi.date().iso().required().messages({
    "date.base": "La fecha debe ser una fecha válida",
    "any.required": "La fecha es obligatoria",
    "date.iso": "La fecha debe estar en formato ISO (YYYY-MM-DD)",
  }),
});

const preFacturaSchema = joi.object({
  clienteId: joi.string().min(3).max(100).required().messages({
    "string.base": "El cliente debe ser una cadena de texto",
    "string.empty": "El cliente es obligatorio",
    "string.min": "El cliente debe tener al menos 3 caracteres",
    "string.max": "El cliente no debe exceder los 100 caracteres",
    "any.required": "El cliente es obligatorio",
  }),
});

module.exports = { preFacturaSchema, dateSchema };
