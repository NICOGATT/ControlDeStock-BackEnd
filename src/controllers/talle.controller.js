const { Talle } = require("../../db/models");
const genericController = require("./generic.controller");

module.exports = {
  createTalle: genericController.createModel(Talle),
  updateTalle: genericController.updateModel(Talle),
  deleteTalle: genericController.deleteModel(Talle),
  getAllTalles: genericController.getAllModels(Talle),
  getTalleById: genericController.getModelById(Talle),
  getTalleByName: genericController.getModelByParam(Talle,"nombre"),
};
