const joi = require("joi");
const { genericSchema } = require("./generic.schema");

const stringSchema = joi.string().min(1).messages({
  "string.base": "{#label} debe ser un texto.",
  "string.empty": "{#label} no puede estar vacío.",
  "string.min": "{#label} debe tener al menos {#limit} caracteres.",
  "any.required": "{#label} es un campo obligatorio.",
});

const clienteSchema = genericSchema.keys({
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

const clienteUpdateSchema = joi.object({
  nombre: stringSchema.label("nombre"),
  telefono: stringSchema.pattern(/^\d{10}$/).label("teléfono").messages({
    "string.pattern.base": `"telefono" debe ser un número de 10 dígitos`,
  }),
  direccion: stringSchema.label("dirección"),
  codigoPostal: stringSchema.pattern(/^\d{4,5}$/).label("codigoPostal").messages({
    "string.pattern.base": `"codigoPostal" debe ser un número de 4 o 5 dígitos`,
  }),
  cuit: stringSchema.pattern(/^\d{2}-\d{8}-\d{1}$/).label("CUIT").messages({
    "string.pattern.base": `"cuit" debe tener el formato XX-XXXXXXXX-X`
  }),
  email: stringSchema.email().label("email").messages({
    "string.email": `"email" debe ser una dirección de correo electrónico válida`,
  }),
  nombreEmpresa: stringSchema.label("nombreEmpresa"),
  condicionTributaria: stringSchema.label("condiciónTributaria"),
})

module.exports = { clienteSchema, clienteUpdateSchema };
