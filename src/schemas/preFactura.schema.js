const joi = require("joi");

const dateSchema = joi.object({
  fecha: joi.date().iso().required().messages({
    "date.base": "La fecha debe ser una fecha válida",
    "any.required": "La fecha es obligatoria",
    "date.iso": "La fecha debe estar en formato ISO (YYYY-MM-DD)",
  }),
});

const stringSchema = joi.string().min(1).messages({
  "string.base": "{#label} debe ser una cadena de texto",
  "string.empty": "{#label} no puede estar vacío",
  "string.min": "{#label} debe tener al menos 1 carácter",
  "any.required": "{#label} es obligatorio",
});

const preFacturaSchema = joi.object({
  cliente: stringSchema.label("cliente").required(),
  telefono: stringSchema.required().pattern(/^\d{10}$/).label("teléfono").messages({
    "string.pattern.base": `"telefono" debe ser un número de 10 dígitos`,
  }),
  direccion: stringSchema.required().label("dirección"),
  codigoPostal: stringSchema.required().pattern(/^\d{4,5}$/).label("codigoPostal").messages({
    "string.pattern.base": `"codigoPostal" debe ser un número de 4 o 5 dígitos`,
  }),
  ciudad: stringSchema.required().label("ciudad"),
  provincia: stringSchema.required().label("provincia"),
  cuit: stringSchema.required().pattern(/^\d{2}-\d{8}-\d{1}$/).label("cuit").messages({
    "string.pattern.base": `"cuit" debe tener el formato XX-XXXXXXXX-X`
  }),
  email: stringSchema.required().email().label("email").messages({
    "string.email": `"email" debe ser una dirección de correo electrónico válida`,
  }),
  nombreEmpresa: stringSchema.required().label("nombreEmpresa"),
  condicionTributaria: stringSchema.required().label("condiciónTributaria"),
});

module.exports = { preFacturaSchema, dateSchema };
