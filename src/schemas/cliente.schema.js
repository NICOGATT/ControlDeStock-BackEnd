const joi = require("joi");
const { genericSchema } = require("./generic.schema");

const stringSchema = joi.string().min(1).messages({
  "string.base": "{#label} debe ser un texto.",
  "string.empty": "{#label} no puede estar vacío.",
  "string.min": "{#label} debe tener al menos {#limit} caracteres.",
  "any.required": "{#label} es un campo obligatorio.",
});

const clienteSchema = genericSchema.keys({
  telefono: stringSchema.pattern(/^\d{10}$/).optional().label("teléfono").messages({
    "string.pattern.base": `"telefono" debe ser un número de 10 dígitos`,
  }),
  direccion: stringSchema.optional().label("dirección"),
  codigoPostal: stringSchema.pattern(/^\d{4,5}$/).optional().label("codigoPostal").messages({
    "string.pattern.base": `"codigoPostal" debe ser un número de 4 o 5 dígitos`,
  }),
  ciudad: stringSchema.optional().label("ciudad"),
  provincia: stringSchema.optional().label("provincia"),
  cuit: stringSchema.pattern(/^\d{2}-\d{8}-\d{1}$/).optional().label("cuit").messages({
    "string.pattern.base": `"cuit" debe tener el formato XX-XXXXXXXX-X`
  }),
  email: stringSchema.email().optional().label("email").messages({
    "string.email": `"email" debe ser una dirección de correo electrónico válida`,
  }),
  nombreEmpresa: stringSchema.optional().label("nombreEmpresa"),
  condicionTributaria: stringSchema.optional().label("condiciónTributaria"),
});

const clienteUpdateSchema = joi.object({
  nombre: stringSchema.optional().label("nombre"),
  telefono: stringSchema.pattern(/^\d{10}$/).optional().label("teléfono").messages({
    "string.pattern.base": `"telefono" debe ser un número de 10 dígitos`,
  }),
  direccion: stringSchema.optional().label("dirección"),
  codigoPostal: stringSchema.pattern(/^\d{4,5}$/).optional().label("codigoPostal").messages({
    "string.pattern.base": `"codigoPostal" debe ser un número de 4 o 5 dígitos`,
  }),
  cuit: stringSchema.pattern(/^\d{2}-\d{8}-\d{1}$/).optional().label("CUIT").messages({
    "string.pattern.base": `"cuit" debe tener el formato XX-XXXXXXXX-X`
  }),
  email: stringSchema.email().optional().label("email").messages({
    "string.email": `"email" debe ser una dirección de correo electrónico válida`,
  }),
  nombreEmpresa: stringSchema.optional().label("nombreEmpresa"),
  condicionTributaria: stringSchema.optional().label("condiciónTributaria"),
})

module.exports = { clienteSchema, clienteUpdateSchema };
