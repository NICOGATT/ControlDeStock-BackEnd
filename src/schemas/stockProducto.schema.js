const joi = require('joi');
const { colorYTalleSchema, idSchema } = require('./producto.schema');

const arrayOfColorYTalleSchema = (schema) => joi.array().items(schema).min(1).required()
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
      'array.base': 'coloresYTalles debe ser un arreglo',
      'array.min': 'coloresYTalles debe tener al menos 1 elemento',
      'any.required': 'coloresYTalles es obligatorio',
      'array.unique': 'No se permiten combinaciones repetidas de color y talle',
    });

const colorYTalleUpdateSchema = joi.object({
  color: colorYTalleSchema.extract('color').label('color'),
  talle: colorYTalleSchema.extract('talle').label('talle'),
  cantidad: colorYTalleSchema.extract('cantidad').label('cantidad').optional(),
  precio: colorYTalleSchema.extract('precio').label('precio').optional(),
})

const createStockProductoSchema = joi.object({
  coloresYTalles: arrayOfColorYTalleSchema(colorYTalleSchema),
  productoId: idSchema,
});

const updateStockProductoSchema = joi.object({
  coloresYTalles: arrayOfColorYTalleSchema(colorYTalleUpdateSchema),
  productoId: idSchema,
});

module.exports = { createStockProductoSchema, colorYTalleSchema, updateStockProductoSchema };