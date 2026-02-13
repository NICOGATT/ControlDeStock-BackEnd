const joi = require("joi");

const stringSchema = joi.string().min(1).required().messages({
  "string.base": "El campo debe ser una cadena de texto",
  "string.empty": "El campo no puede estar vacío",
  "string.min": "El campo debe tener al menos 1 caracter",
  "any.required": "El campo es obligatorio",
});

const colorYTalleSchema = joi.object({
  color: stringSchema.label("color"),
  talle: stringSchema.label("talle"),
  cantidad: joi.number().integer().min(0).required().messages({
    "number.base": "La cantidad debe ser un número",
    "number.integer": "La cantidad debe ser un número entero",
    "number.min": "La cantidad debe ser al menos 0",
    "any.required": "La cantidad es obligatoria",
  }),
});

const productoSchema = joi.object({
  colorYTalle: joi
    .array()
    .items(colorYTalleSchema)
    .min(1)
    .required()
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
      "array.base": "El campo colorYTalle debe ser un arreglo",
      "array.min": "El campo colorYTalle debe tener al menos un elemento",
      "any.required": "El campo colorYTalle es obligatorio",
      "array.unique": "No se pueden repetir combinaciones de color y talle en el mismo producto",
    }),
  nombre: joi.string().min(1).required().messages({
    "string.base": "El nombre debe ser una cadena de texto",
    "string.empty": "El nombre no puede estar vacío",
    "string.min": "El nombre debe tener al menos 1 caracter",
    "any.required": "El nombre es obligatorio",
  }),
  precio: joi.number().integer().min(1).required().messages({
    "number.base": "El precio debe ser un número",
    "number.integer": "El precio debe ser un número entero",
    "number.min": "El precio debe ser al menos 1",
    "any.required": "El precio es obligatorio",
  }),
  tipoDePrenda: stringSchema.label("tipo de prenda"),
});

const productoUpdateSchema = productoSchema.fork(
  Object.keys(productoSchema.describe().keys),
  (field) => field.optional(),
);

module.exports = { productoUpdateSchema, productoSchema };
