const { Cliente } = require("../../db/models");
const genericValidations = require("./genericValidations");
const { clienteSchema, clienteUpdateSchema } = require("../schemas/cliente.schema");

const validateClienteSchema = genericValidations.validateSchema(clienteSchema);
const validateClienteUpdateSchema = genericValidations.validateSchema(clienteUpdateSchema);
const validateClienteById = genericValidations.validateModelById(Cliente);
const validateClienteName = async (req, res, next) => {
  const { nombre } = req.params;
  const cliente = await Cliente.findOne({ where: { nombre } });
  if (cliente) {
    return res.status(400).json({ message: `Cliente con el nombre ${nombre} ya existe` });
  }
  next();
};

const validateClienteByName = genericValidations.validateModelByParam(Cliente, "nombre");

module.exports = {
  validateClienteSchema,
  validateClienteUpdateSchema,
  validateClienteById,
  validateClienteName,
  validateClienteByName
};