const { preFacturaSchema, dateSchema } = require("../schemas/preFactura.schema");
const { PreFactura, Cliente } = require("../../db/models");
const genericValidations = require("./genericValidations");
const genericSchemaValidator = require("../schemas/genericSchemaValidator");
const mapErrors = require("./mapErrors");
const {validateClienteByName} = require("./cliente.middleware");

const validateDate = async (req, res, next) => {
  const errores = genericSchemaValidator(dateSchema, {fecha:req.params.fecha});
  if (errores) {
    return res.status(400).json(mapErrors(errores));
  }
  next();
}

module.exports = {
  validatePreFacturaSchema: genericValidations.validateSchema(preFacturaSchema),
  validatePreFacturaById: genericValidations.validateModelById(PreFactura),
  validateDate,
  validateCliente: validateClienteByName
};