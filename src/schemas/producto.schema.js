const joi = require("joi");

const stringSchema = joi.string().min(1).messages({
  "string.base": "El campo debe ser una cadena de texto",
  "string.empty": "El campo no puede estar vacío",
  "string.min": "El campo debe tener al menos 1 caracter",
});

const idSchema = stringSchema.pattern(/^RPPRO \d{2}-\d{2}$/).required().label("id").messages(
    {
      "string.pattern.base": "El id debe seguir el formato RPPRO XX-XX, donde XX son números",
      "any.required": "El campo id es obligatorio",
    }
  )
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
  id: idSchema,
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
  nombre: stringSchema.required().label("nombre").messages({
    "any.required": "El campo nombre es obligatorio",
  }),
  precio: joi.number().integer().min(1).required().messages({
    "number.base": "El precio debe ser un número",
    "number.integer": "El precio debe ser un número entero",
    "number.min": "El precio debe ser al menos 1",
    "any.required": "El campo precio es obligatorio",
  }),
  tipoDePrenda: stringSchema.required().label("nombre").messages({
    "any.required": "El campo nombre es obligatorio",
  })
});

const productoUpdateSchema = joi.object({
  nombre: stringSchema.label("nombre"),
  precio: joi.number().integer().min(1).label("precio").messages({
    "number.base": "El precio debe ser un número",
    "number.integer": "El precio debe ser un número entero",
    "number.min": "El precio debe ser al menos 1",
  }),
  tipoDePrenda: stringSchema.label("tipoDePrenda")
})

module.exports = { productoUpdateSchema, productoSchema, colorYTalleSchema, idSchema };
