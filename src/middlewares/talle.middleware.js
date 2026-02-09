const { genericSchema } = require("../schemas/generic.schema");
const { Talle } = require("../../db/models");
const genericValidations = require("./genericValidations");

module.exports = {
  validateTalleSchema: genericValidations.validateSchema(genericSchema),
  validateTalleById: genericValidations.validateModelById(Talle),
  validateTalleByName: genericValidations.validateModelByParam(Talle,"nombre"),
  validateTalleName: genericValidations.validateModelName(Talle)
};
