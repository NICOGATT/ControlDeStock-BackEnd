const joi = require('joi');

const createStockProductoSchema = joi.object({
  productoId: joi.string().required(),
  talleId: joi.string().required(),
  
});