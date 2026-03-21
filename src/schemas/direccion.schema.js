const joi = require("joi");

const stringSchema = joi.string().min(1).messages({
  "string.base": "{#label} debe ser un texto.",
  "string.empty": "{#label} no puede estar vacío.",
  "string.min": "{#label} debe tener al menos {#limit} caracteres.",
  "any.required": "{#label} es un campo obligatorio.",
});

const numberSchema = joi.number().min(1).integer().messages({
  "number.base": "{#label} debe ser un número.",
  "number.min": "{#label} debe ser un número positivo.",
  "number.integer": "{#label} debe ser un número entero.",
  "any.required": "{#label} es un campo obligatorio.",
});

const direccionSchema = joi.object({
  direccion: stringSchema.required().label("dirección"),
  clienteId: numberSchema.required().label("clienteId"),
  codigoPostal: joi.string().required().pattern(/^\d{4,5}$/).label("codigoPostal").messages({
    "string.pattern.base": `"codigoPostal" debe ser un número de 4 o 5 dígitos`,
  }),
  ciudad: stringSchema.required().label("ciudad"),
  provincia: stringSchema.required().label("provincia"),
});

const direccionUpdateSchema = joi.object({
  direccion: stringSchema.required().label("dirección"),
  clienteId: numberSchema.required().label("clienteId"),
  direccionNueva: stringSchema.optional().label("direccionNueva"),
  codigoPostal: joi.string().pattern(/^\d{4,5}$/).label("codigoPostal").messages({
    "string.pattern.base": `"codigoPostal" debe ser un número de 4 o 5 dígitos`,
  }),
  ciudad: stringSchema.optional().label("ciudad"),
  provincia: stringSchema.optional().label("provincia"),
});

module.exports = { direccionSchema, direccionUpdateSchema };
