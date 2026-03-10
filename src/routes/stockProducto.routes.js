const express = require('express');
const router = express.Router();
const {
  validateStockProductoSchema,
  validateUpdateStockProductoSchema,
  validateStockProductoExists,
  validateStockProductoNonExists,
  validateStockProductoQuantity,
} = require("../middlewares/stockProducto.middleware")
const {
  validateProductoByIdBody
} = require("../middlewares/producto.middleware");
const {
  createStockProducto,
  updateStockProducto,
  addStockProductoQuantity,
  reduceStockProductoQuantity,
  deleteStockProducto,
  getAllStockProductos,
  getStockProductoByProductoId,
} = require('../controllers/stockProducto.controller');

/**
 * @swagger
 * tags:
 *   name: StockProductos
 * components:
 *   schemas:
 *     StockProducto:
 *       type: object
 *       properties:
 *         stock:
 *           type: integer
 *           description: Cantidad en stock
 *           example: 50
 *         precio:
 *           type: integer
 *           description: Precio para esta combinación de color y talle
 *           example: 1200
 *         producto:
 *           type: object
 *           description: Información del producto asociado
 *         color:
 *           type: object
 *           description: Información del color asociado
 *         talle:
 *           type: object
 *           description: Información del talle asociado
 *     ColorYTalle:
 *       type: object
 *       required:
 *         - color
 *         - talle
 *         - cantidad
 *         - precio
 *       properties:
 *         color:
 *           type: string
 *           description: Nombre del color
 *           example: "Rojo"
 *         talle:
 *           type: string
 *           description: Nombre del talle
 *           example: "M"
 *         cantidad:
 *           type: integer
 *           description: Cantidad de stock
 *           example: 50
 *         precio:
 *           type: integer
 *           description: Precio para esta combinación de color y talle
 *           example: 1200
 *     ColorYTalleCantidad:
 *       type: object
 *       required:
 *         - color
 *         - talle
 *         - cantidad
 *       properties:
 *         color:
 *           type: string
 *           description: Nombre del color
 *           example: "Rojo"
 *         talle:
 *           type: string
 *           description: Nombre del talle
 *           example: "M"
 *         cantidad:
 *           type: integer
 *           description: Cantidad de stock a sumar o restar
 *           example: 10
 *     StockProductoInput:
 *       type: object
 *       required:
 *         - productoId
 *         - coloresYTalles
 *       properties:
 *         productoId:
 *           type: string
 *           description: ID del producto con formato RPPRO XX-XX
 *           example: "RPPRO 01-23"
 *         coloresYTalles:
 *           type: array
 *           description: Lista de combinaciones de colores y talles con cantidades
 *           items:
 *             $ref: '#/components/schemas/ColorYTalle'
 *     StockProductoCantidadInput:
 *       type: object
 *       required:
 *         - productoId
 *         - coloresYTalles
 *       properties:
 *         productoId:
 *           type: string
 *           description: ID del producto con formato RPPRO XX-XX
 *           example: "RPPRO 01-23"
 *         coloresYTalles:
 *           type: array
 *           description: Lista de combinaciones de colores y talles con cantidades
 *           items:
 *             $ref: '#/components/schemas/ColorYTalleCantidad'
 */

//1. Crear stock de producto VERIFICADO SWAGGER DOCUMENTADO
/**
 * @swagger
 * /api/stockProductos:
 *   post:
 *     summary: Crear stock de producto
 *     description: Crea nuevos registros de stock para un producto con combinaciones de color y talle
 *     tags: [StockProductos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StockProductoInput'
 *           example:
 *             productoId: "RPPRO 01-23"
 *             coloresYTalles:
 *               - color: "Rojo"
 *                 talle: "M"
 *                 cantidad: 50
 *                 precio: 1200
 *               - color: "Azul"
 *                 talle: "L"
 *                 cantidad: 30
 *                 precio: 1100
 *     responses:
 *       201:
 *         description: Stock creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StockProducto'
 *             example:
 *               - stock: 50
 *                 precio: 1200
 *                 producto:
 *                   id: "RPPRO 01-23"
 *                   nombre: "Remera básica"
 *                 color:
 *                   id: 1
 *                   nombre: "Rojo"
 *                 talle:
 *                   id: 1
 *                   nombre: "M"
 *               - stock: 30
 *                 precio: 1100
 *                 producto:
 *                   id: "RPPRO 01-23"
 *                   nombre: "Remera básica"
 *                 color:
 *                   id: 2
 *                   nombre: "Azul"
 *                 talle:
 *                   id: 2
 *                   nombre: "L"
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             examples:
 *               validationError:
 *                 summary: Error de validación
 *                 value:
 *                   - atributo: "productoId"
 *                     mensaje: "productoId es requerido"
 *               stockExists:
 *                 summary: Stock ya existe
 *                 value:
 *                   message: "Ya existe stock del producto: Remera básica, de color Rojo y talle M"
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             example:
 *               message: "No se encontró el producto con id 13"
 */
router.post('/',
  validateStockProductoSchema,
  validateProductoByIdBody,
  validateStockProductoNonExists, 
  createStockProducto
);

//2. Actualizar stock de producto por id VERIFICADO SWAGGER DOCUMENTADO
/**
 * @swagger
 * /api/stockProductos:
 *   put:
 *     summary: Actualizar stock de producto
 *     description: Actualiza la cantidad de stock para combinaciones de color y talle de un producto
 *     tags: [StockProductos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StockProductoInput'
 *           example:
 *             productoId: "RPPRO 01-23"
 *             coloresYTalles:
 *               - color: "Rojo"
 *                 talle: "M"
 *                 cantidad: 75
 *                 precio: 1200
 *               - color: "Azul"
 *                 talle: "L"
 *                 cantidad: 45
 *                 precio: 1100
 *     responses:
 *       200:
 *         description: Stock actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StockProducto'
 *             example:
 *               - stock: 75
 *                 precio: 1200
 *                 producto:
 *                   id: "RPPRO 01-23"
 *                   nombre: "Remera básica"
 *                 color:
 *                   id: 1
 *                   nombre: "Rojo"
 *                 talle:
 *                   id: 1
 *                   nombre: "M"
 *               - stock: 45
 *                 precio: 1100
 *                 producto:
 *                   id: "RPPRO 01-23"
 *                   nombre: "Remera básica"
 *                 color:
 *                   id: 2
 *                   nombre: "Azul"
 *                 talle:
 *                   id: 2
 *                   nombre: "L"
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             example:
 *               - atributo: "coloresYTalles"
 *                 mensaje: "coloresYTalles debe tener al menos 1 elemento"
 *       404:
 *         description: Producto o stock no encontrado
 *         content:
 *           application/json:
 *             examples:
 *               productoNotFound:
 *                 summary: Producto no encontrado
 *                 value:
 *                   message: "No se encontró el producto con id RPPRO 01-23"
 *               stockNotFound:
 *                 summary: Stock no encontrado
 *                 value:
 *                   message: "No se encontró stock asociado al producto: Remera básica, de color Rojo y talle M"
 */
router.put('/',
  validateUpdateStockProductoSchema,
  validateProductoByIdBody,
  validateStockProductoExists,
  updateStockProducto
);

//4. añadir stock a un producto
/**
 * @swagger
 * /api/stockProductos/add-stock:
 *   put:
 *     summary: Añadir cantidad al stock de un producto
 *     description: Incrementa la cantidad de stock para combinaciones de color y talle de un producto
 *     tags: [StockProductos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StockProductoCantidadInput'
 *           example:
 *             productoId: "RPPRO 01-23"
 *             coloresYTalles:
 *               - color: "Rojo"
 *                 talle: "M"
 *                 cantidad: 10
 *               - color: "Azul"
 *                 talle: "L"
 *                 cantidad: 5
 *     responses:
 *       200:
 *         description: Stock incrementado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StockProducto'
 *             example:
 *               - stock: 60
 *                 precio: 1200
 *                 producto:
 *                   id: "RPPRO 01-23"
 *                   nombre: "Remera básica"
 *                 color:
 *                   id: 1
 *                   nombre: "Rojo"
 *                 talle:
 *                   id: 1
 *                   nombre: "M"
 *               - stock: 35
 *                 precio: 1100
 *                 producto:
 *                   id: "RPPRO 01-23"
 *                   nombre: "Remera básica"
 *                 color:
 *                   id: 2
 *                   nombre: "Azul"
 *                 talle:
 *                   id: 2
 *                   nombre: "L"
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             example:
 *               - atributo: "coloresYTalles"
 *                 mensaje: "coloresYTalles debe tener al menos 1 elemento"
 *       404:
 *         description: Producto o stock no encontrado
 *         content:
 *           application/json:
 *             examples:
 *               productoNotFound:
 *                 summary: Producto no encontrado
 *                 value:
 *                   message: "No se encontró el producto con id RPPRO 01-23"
 *               stockNotFound:
 *                 summary: Stock no encontrado
 *                 value:
 *                   message: "No se encontró stock asociado al producto: Remera básica, de color Rojo y talle M"
 */
router.put('/add-stock',
  validateUpdateStockProductoSchema,
  validateProductoByIdBody,
  validateStockProductoExists,
  addStockProductoQuantity
);

//5. restar stock a un producto
/**
 * @swagger
 * /api/stockProductos/reduce-stock:
 *   put:
 *     summary: Restar cantidad al stock de un producto
 *     description: Decrementa la cantidad de stock para combinaciones de color y talle de un producto
 *     tags: [StockProductos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StockProductoCantidadInput'
 *           example:
 *             productoId: "RPPRO 01-23"
 *             coloresYTalles:
 *               - color: "Rojo"
 *                 talle: "M"
 *                 cantidad: 10
 *               - color: "Azul"
 *                 talle: "L"
 *                 cantidad: 5
 *     responses:
 *       200:
 *         description: Stock decrementado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StockProducto'
 *             example:
 *               - stock: 40
 *                 precio: 1200
 *                 producto:
 *                   id: "RPPRO 01-23"
 *                   nombre: "Remera básica"
 *                 color:
 *                   id: 1
 *                   nombre: "Rojo"
 *                 talle:
 *                   id: 1
 *                   nombre: "M"
 *               - stock: 25
 *                 precio: 1100
 *                 producto:
 *                   id: "RPPRO 01-23"
 *                   nombre: "Remera básica"
 *                 color:
 *                   id: 2
 *                   nombre: "Azul"
 *                 talle:
 *                   id: 2
 *                   nombre: "L"
 *       400:
 *         description: Error de validación o stock insuficiente
 *         content:
 *           application/json:
 *             examples:
 *               validationError:
 *                 summary: Error de validación
 *                 value:
 *                   - atributo: "coloresYTalles"
 *                     mensaje: "coloresYTalles debe tener al menos 1 elemento"
 *               insufficientStock:
 *                 summary: Stock insuficiente
 *                 value:
 *                   message: "No hay stock suficiente: de Remera básica, de color Rojo y talle M, el stock actual es 5 y se requiere 10"
 *       404:
 *         description: Producto o stock no encontrado
 *         content:
 *           application/json:
 *             examples:
 *               productoNotFound:
 *                 summary: Producto no encontrado
 *                 value:
 *                   message: "No se encontró el producto con id RPPRO 01-23"
 *               stockNotFound:
 *                 summary: Stock no encontrado
 *                 value:
 *                   message: "No se encontró stock asociado al producto: Remera básica, de color Rojo y talle M"
 */
router.put('/reduce-stock',
  validateUpdateStockProductoSchema,
  validateProductoByIdBody,
  validateStockProductoExists,
  validateStockProductoQuantity,
  reduceStockProductoQuantity
);

//6. Eliminar stock de producto por id VERIFICADO SWAGGER DOCUMENTADO
/**
 * @swagger
 * /api/stockProductos:
 *   delete:
 *     summary: Eliminar stock de producto
 *     description: Elimina registros de stock para combinaciones de color y talle de un producto
 *     tags: [StockProductos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productoId
 *               - coloresYTalles
 *             properties:
 *               productoId:
 *                 type: string
 *                 description: ID del producto con formato RPPRO XX-XX
 *                 example: "RPPRO 01-23"
 *               coloresYTalles:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     color:
 *                       type: string
 *                       example: "Rojo"
 *                     talle:
 *                       type: string
 *                       example: "M"
 *           example:
 *             productoId: "RPPRO 01-23"
 *             coloresYTalles:
 *               - color: "Rojo"
 *                 talle: "M"
 *               - color: "Azul"
 *                 talle: "L"
 *     responses:
 *       204:
 *         description: Stock eliminado exitosamente
 *       404:
 *         description: Producto o stock no encontrado
 *         content:
 *           application/json:
 *             examples:
 *               productoNotFound:
 *                 summary: Producto no encontrado
 *                 value:
 *                   message: "No se encontró el producto con id RPPRO 01-23"
 *               stockNotFound:
 *                 summary: Stock no encontrado
 *                 value:
 *                   message: "No se encontró stock asociado al producto: Remera básica, de color Rojo y talle M"
 */
router.delete('/',
  validateProductoByIdBody,
  validateStockProductoExists,
  deleteStockProducto
);

//7. Obtener todos los stocks de productos VERIFICADO SWAGGER DOCUMENTADO
/**
 * @swagger
 * /api/stockProductos:
 *   get:
 *     summary: Obtener todos los stocks de productos
 *     description: Retorna una lista con todos los registros de stock de productos
 *     tags: [StockProductos]
 *     responses:
 *       200:
 *         description: Lista de stocks obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StockProducto'
 *             example:
 *               - stock: 50
 *                 precio: 1200
 *                 producto:
 *                   id: "RPPRO 01-23"
 *                   nombre: "Remera básica"
 *                 color:
 *                   id: 1
 *                   nombre: "Rojo"
 *                 talle:
 *                   id: 1
 *                   nombre: "M"
 *               - stock: 30
 *                 precio: 1100
 *                 producto:
 *                   id: "RPPRO 01-23"
 *                   nombre: "Remera básica"
 *                 color:
 *                   id: 2
 *                   nombre: "Azul"
 *                 talle:
 *                   id: 2
 *                   nombre: "L"
 */
router.get('/', getAllStockProductos);

//8. Obtener stock de producto por id de producto VERIFICADO SWAGGER DOCUMENTADO
/**
 * @swagger
 * /api/stockProductos/producto/{productoId}:
 *   get:
 *     summary: Obtener stock por ID de producto
 *     description: Obtiene todos los registros de stock asociados a un producto específico
 *     tags: [StockProductos]
 *     parameters:
 *       - in: path
 *         name: productoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto con formato RPPRO XX-XX
 *         example: "RPPRO 01-23"
 *     responses:
 *       200:
 *         description: Stock obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StockProducto'
 *             example:
 *               - stock: 50
 *                 precio: 1200
 *                 producto:
 *                   id: "RPPRO 01-23"
 *                   nombre: "Remera básica"
 *                 color:
 *                   id: 1
 *                   nombre: "Rojo"
 *                 talle:
 *                   id: 1
 *                   nombre: "M"
 *               - stock: 30
 *                 precio: 1100
 *                 producto:
 *                   id: "RPPRO 01-23"
 *                   nombre: "Remera básica"
 *                 color:
 *                   id: 2
 *                   nombre: "Azul"
 *                 talle:
 *                   id: 2
 *                   nombre: "L"
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             example:
 *               message: "No se encontró el producto con id RPPRO 01-23"
 */
router.get('/producto/:productoId',
  getStockProductoByProductoId
);


module.exports = router;

