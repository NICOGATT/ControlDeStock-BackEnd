const { TipoDePrenda } = require("../../db/models");
const genericController = require("./generic.controller");

module.exports = {
  createTipoDePrenda: genericController.createModel(TipoDePrenda),
  updateTipoDePrenda: genericController.updateModel(TipoDePrenda),
  deleteTipoDePrenda: genericController.deleteModel(TipoDePrenda),
  getAllTipoDePrendas: genericController.getAllModels(TipoDePrenda),
  getTipoDePrendaById: genericController.getModelById(TipoDePrenda),
  getTipoDePrendaByName: genericController.getModelByParam(TipoDePrenda,"nombre"),
};