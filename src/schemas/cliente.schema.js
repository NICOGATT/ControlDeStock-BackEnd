const joi = require("joi");
const { genericSchema } = require("./generic.schema");

const clienteSchema = genericSchema.keys({
  telefono: joi.string().pattern(/^\d{10}$/).required().messages({
      "string.base": `"telefono" debe ser un texto`,
      "string.empty": `"telefono" no puede estar vacío`,
      "string.pattern.base": `"telefono" debe ser un número de 10 dígitos`,
      "any.required": `"telefono" es obligatorio`,
    }),
});

const clienteUpdateSchema = clienteSchema.fork(Object.keys(clienteSchema.describe().keys), (field) => field.optional());

module.exports = { clienteSchema, clienteUpdateSchema };
