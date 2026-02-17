const { Cliente } = require("../../db/models");
const genericValidations = require("./genericValidations");
const { clienteSchema, clienteUpdateSchema } = require("../schemas/cliente.schema");

const validateClienteSchema = genericValidations.validateSchema(clienteSchema);
const validateClienteUpdateSchema = genericValidations.validateSchema(clienteUpdateSchema);
const validateClienteById = genericValidations.validateModelById(Cliente);
const validateClienteName = genericValidations.validateModelName(Cliente);

const validateClienteByName = genericValidations.validateModelByParam(Cliente, "nombre");

module.exports = {
  validateClienteSchema,
  validateClienteUpdateSchema,
  validateClienteById,
  validateClienteName,
  validateClienteByName
};