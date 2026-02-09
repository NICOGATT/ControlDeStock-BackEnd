const genericSchemaValidator = require("../schemas/genericSchemaValidator");
const mapErrors = require("./mapErrors");

const validateSchema = (schema) => (req, res, next) => {
  const errores = genericSchemaValidator(schema, req.body);
  
  if (errores) {
    return res.status(400).json(mapErrors(errores));
  }
  next();
}

const validateModelById = (Model) => async (req, res, next) =>  {
  const instance = await Model.findByPk(req.params.id);
  if (!instance) {
    return res.status(404).json({ message: `${Model.name} con id ${req.params.id} no existe` });
  }
  next();
}

const validateModelName = (Model) => async (req, res, next) => {
  const { nombre } = req.body;
  const instance = await Model.findOne({ where: { nombre } });
  if (instance) {
    return res.status(400).json({ message: `${Model.name} con el nombre ${nombre} ya esta en uso` });
  }
  next();
}

const validateModelByParam = (Model, param) => async (req, res, next) => {
  const value = req.params[param];
  const instance = await Model.findOne({ where: { [param]: value } });
  if (!instance) {
    return res.status(404).json({ message: `${Model.name} con ${param} ${value} no existe` });
  }
  next();
}

module.exports = {
  validateSchema,
  validateModelById,
  validateModelName,
  validateModelByParam
};