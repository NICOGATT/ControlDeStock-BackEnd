const { TipoDePrenda } = require("../../db/models");
const genericValidations = require("./genericValidations");
const { genericSchema } = require("../schemas/generic.schema");

const validateTipoDePrendaSchema = genericValidations.validateSchema(genericSchema);
const validateTipoDePrendaById = genericValidations.validateModelById(TipoDePrenda);
const validateTipoDePrendaByName = genericValidations.validateModelByParam(TipoDePrenda, "nombre");
const validateTipoDePrendaName = genericValidations.validateModelName(TipoDePrenda);

module.exports = {
  validateTipoDePrendaSchema,
  validateTipoDePrendaById,
  validateTipoDePrendaByName,
  validateTipoDePrendaName
};