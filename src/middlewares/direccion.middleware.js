const { Direccion, Cliente } = require("../../db/models");
const { direccionSchema, direccionUpdateSchema } = require("../schemas/direccion.schema");
const genericValidator = require("./genericValidations");

const validateDireccionSchema = genericValidator.validateSchema(direccionSchema);

const validateDireccionUpdateSchema = genericValidator.validateSchema(direccionUpdateSchema);

const validateDireccionExists = async (req, res, next) => {
  const { clienteId, direccion } = req.body;

  const direccionInstance = await Direccion.findOne({ where: { clienteId, direccion } });

  if (!direccionInstance) {
    return res.status(404).json({ message: "Dirección no encontrada para el cliente especificado." });
  }
  next();
}

const validateDireccionNonExists = async (req, res, next) => {
  const { direccion } = req.body;

  const direccionInstance = await Direccion.findOne({ where: { direccion } });

  if (direccionInstance) {
    const clienteInstance = await Cliente.findByPk(direccionInstance.clienteId);
    return res.status(400).json({ message: `La direccion ya se encuentra asociada al cliente: ${clienteInstance.nombre}` });
  }
  next();
}

const validateDireccionName = async (req, res, next) => {
  const { direccionNueva } = req.body;

  if (!direccionNueva) {
    return next(); // Si no se proporciona una nueva dirección, no es necesario validar el nombre
  }

  const direccionInstance = await Direccion.findOne({ where: { direccion: direccionNueva } });
  if (direccionInstance) {
    const clienteInstance = await Cliente.findByPk(direccionInstance.clienteId);
    return res.status(400).json({ message: `Ya existe una direccion con ese nombre, esta asociada al cliente: ${clienteInstance.nombre}` });
  }
  next();
}

module.exports = {
  validateDireccionSchema,
  validateDireccionUpdateSchema,
  validateDireccionExists,
  validateDireccionNonExists,
  validateDireccionName
};