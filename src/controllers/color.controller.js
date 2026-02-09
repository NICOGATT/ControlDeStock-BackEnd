const { Color } = require("../../db/models");
const genericController = require("./generic.controller");

module.exports = {
  createColor: genericController.createModel(Color),
  updateColor: genericController.updateModel(Color),
  deleteColor: genericController.deleteModel(Color),
  getAllColor: genericController.getAllModels(Color),
  getColorById: genericController.getModelById(Color),
  getColorByName: genericController.getModelByParam(Color,"nombre"),
};
