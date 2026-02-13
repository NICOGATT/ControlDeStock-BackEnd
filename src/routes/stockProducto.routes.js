const express = require('express');
const router = express.Router();
const {
  validateStockProductoSchema,
  validateStockProductoExists,
  validateStockProductoQuantity,
} = require("../middlewares/stockProducto.middleware")
const {
  validateProductoById
} = require("../middlewares/producto.middleware");
const {
  createStockProducto,
  updateStockProducto,
  deleteStockProducto,
  getAllStockProductos,
  getStockProductoByProductoId,
} = require('../controllers/stockProducto.controller');


//1. Crear stock de producto
router.post('/', 
  validateStockProductoSchema, 
  createStockProducto
);

//2. Actualizar stock de producto por id
router.put('/',
  validateStockProductoSchema,
  validateProductoById,
  validateStockProductoExists,
  validateStockProductoQuantity,
  updateStockProducto
);

//3. Eliminar stock de producto por id
router.delete('/',
  validateProductoById,
  deleteStockProducto
);

//4. Obtener stock de producto por id de producto
router.get('/producto',
  validateProductoById,
  getStockProductoByProductoId
);

//5. Obtener todos los stocks de productos
router.get('/', getAllStockProductos);

module.exports = router;

