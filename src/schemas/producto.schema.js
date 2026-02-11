const joi = require("joi");
const { genericSchema } = require("./generic.schema");

const productoSchema = joi.object({
  nombre: joi.string().min(1).required().messages({
    "string.base": "El nombre debe ser una cadena de texto",
    "string.empty": "El nombre no puede estar vacío",
    "string.min": "El nombre debe tener al menos 1 caracter",
    "any.required": "El nombre es obligatorio",
  }),
  cantidad: joi.number().integer().min(1).required().messages({
    "number.base": "La cantidad debe ser un número",
    "number.integer": "La cantidad debe ser un número entero",
    "number.min": "La cantidad debe ser al menos 1",
    "any.required": "La cantidad es obligatoria",
  }),
  precio: joi.number().integer().min(1).required().messages({
    "number.base": "El precio debe ser un número",
    "number.integer": "El precio debe ser un número entero",
    "number.min": "El precio debe ser al menos 1",
    "any.required": "El precio es obligatorio",
  }),
  color: genericSchema.required(),
  talle: genericSchema.required(),
  tipoDePrenda: genericSchema.required()
});

const productoUpdateSchema = productoSchema.fork(Object.keys(productoSchema.describe().keys), (field) => field.optional());


module.exports = { productoUpdateSchema, productoSchema };
