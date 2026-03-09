const express = require('express');
const router = express.Router();
const {
  validatePreFacturaProductoSchema,
  validatePreFacturaProductoDeleteSchema,
  validatePreFacturaProductoExistence,
  validatePreFacturaProductoNonExistence
} = require("../middlewares/preFacturaProducto.middleware");
const {
  validatePreFacturaById 
} = require("../middlewares/preFactura.middleware");
const {
  validateStockProductoExistsByIds
} = require("../middlewares/stockProducto.middleware");
const {
  addProductsToPreFactura,
  editPreFacturaProducto,
  deletePreFacturaProducto,
  getPreFacturaWithProducts,
  getAllPreFacturasWithProducts
} = require("../controllers/preFacturaProducto.controller");

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductoPreFactura:
 *       type: object
 *       properties:
 *         productoId:
 *           type: integer
 *           description: ID del producto
 *         talleId:
 *           type: integer
 *           description: ID del talle
 *         colorId:
 *           type: integer
 *           description: ID del color
 *         cantidad:
 *           type: integer
 *           description: Cantidad del producto
 *       required:
 *         - productoId
 *         - talleId
 *         - colorId
 *         - cantidad
 *       example:
 *         productoId: 1
 *         talleId: 1
 *         colorId: 1
 *         cantidad: 5
 *     PreFacturaProducto:
 *       type: object
 *       properties:
 *         preFacturaId:
 *           type: integer
 *           description: ID de la prefactura
 *         productoId:
 *           type: integer
 *           description: ID del producto (mínimo 1)
 *           minimum: 1
 *         cantidad:
 *           type: integer
 *           description: Cantidad del producto (mínimo 1)
 *           minimum: 1
 *       required:
 *         - preFacturaId
 *         - productoId
 *         - cantidad
 *       example:
 *         preFacturaId: 1
 *         productoId: 2
 *         cantidad: 5
 */

//1. Agregar productos a una prefactura VERIFICADO SWAGGER DOCUMENTADO
/**
 * @swagger
 * /api/preFacturaProductos:
 *   post:
 *     summary: Agregar productos a una prefactura
 *     tags: [PreFacturaProducto]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productos:
 *                 type: array
 *                 description: Lista de productos 
 *                 items:
 *                   type: object
 *                   properties:
 *                     productoId:
 *                       type: string
 *                       description: ID del producto con formato RPPRO XX-XX
 *                       minimum: 1
 *                     talleId:
 *                       type: integer
 *                       description: ID del talle (mínimo 1)
 *                       minimum: 1
 *                     colorId:
 *                       type: integer
 *                       description: ID del color (mínimo 1)
 *                       minimum: 1
 *                     cantidad:
 *                       type: integer
 *                       description: Cantidad del producto (mínimo 1)
 *                       minimum: 1
 *                   required:
 *                     - productoId
 *                     - talleId
 *                     - colorId
 *                     - cantidad
 *               preFacturaId:
 *                 type: integer
 *                 description: ID de la prefactura (mínimo 1)
 *                 minimum: 1
 *             required:
 *               - productos
 *               - preFacturaId
 *             example:
 *               productos:
 *                 - productoId: "RPPRO 01-23"
 *                   talleId: 1
 *                   colorId: 1
 *                   cantidad: 1
 *                 - productoId: "RPPRO 01-24"
 *                   talleId: 1
 *                   colorId: 1
 *                   cantidad: 1
 *               preFacturaId: 1
 *     responses:
 *       201:
 *         description: Productos agregados correctamente
 *         content:
 *           application/json:
 *             example:
 *               preFactura:
 *                 id: 1
 *                 fecha: "2026-02-18T19:07:11.000Z"
 *                 clienteId: 1
 *               productos:
 *                 - cantidad: 1
 *                   producto:
 *                     id: "RPPRO 01-23"
 *                     nombre: "Remera básica"
 *                   color:
 *                     id: 1
 *                     nombre: "Rojo"
 *                   talle:
 *                     id: 1
 *                     nombre: "M"
 *                 - cantidad: 1
 *                   producto:
 *                     id: "RPPRO 01-23"
 *                     nombre: "Remera básica"
 *                   color:
 *                     id: 2
 *                     nombre: "Azul"
 *                   talle:
 *                     id: 1
 *                     nombre: "M"
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             example:
 *               - atributo: productos
 *                 mensaje: No se pueden repetir productos en una misma prefactura
 */
router.post(
  "/",
  validatePreFacturaProductoSchema,
  validatePreFacturaProductoNonExistence,
  validateStockProductoExistsByIds,
  addProductsToPreFactura
);

//2. Editar productos de una prefactura por ID VERIFICADO SWAGGER DOCUMENTADO
/**
 * @swagger
 * /api/preFacturaProductos:
 *   put:
 *     summary: Editar productos de una prefactura
 *     tags: [PreFacturaProducto]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productos:
 *                 type: array
 *                 description: Lista de productos 
 *                 items:
 *                   type: object
 *                   properties:
 *                     productoId:
 *                       type: string
 *                       description: ID del producto con formato RPPRO XX-XX
 *                     talleId:
 *                       type: integer
 *                       description: ID del talle (mínimo 1)
 *                       minimum: 1
 *                     colorId:
 *                       type: integer
 *                       description: ID del color (mínimo 1)
 *                       minimum: 1
 *                     cantidad:
 *                       type: integer
 *                       description: Cantidad del producto (mínimo 1)
 *                       minimum: 1
 *                   required:
 *                     - productoId
 *                     - talleId
 *                     - colorId
 *                     - cantidad
 *               preFacturaId:
 *                 type: integer
 *                 description: ID de la prefactura (mínimo 1)
 *                 minimum: 1
 *             required:
 *               - productos
 *               - preFacturaId
 *             example:
 *               productos:
 *                 - productoId: "RPPRO 01-23"
 *                   talleId: 1
 *                   colorId: 1
 *                   cantidad: 10
 *                 - productoId: "RPPRO 01-24"
 *                   talleId: 1
 *                   colorId: 1
 *                   cantidad: 5
 *               preFacturaId: 1
 *     responses:
 *       200:
 *         description: Productos actualizados correctamente
 *         content:
 *           application/json:
 *             example:
 *               preFactura:
 *                 id: 1
 *                 fecha: "2026-02-20T19:42:38.000Z"
 *                 clienteId: 1
 *               productos:
 *                 - cantidad: 10
 *                   producto:
 *                     id: "RPPRO 01-23"
 *                     nombre: "Remera básica"
 *                   color:
 *                     id: 3
 *                     nombre: "Amarillo"
 *                   talle:
 *                     id: 1
 *                     nombre: "M"
 *                 - cantidad: 5
 *                   producto:
 *                     id: "RPPRO 01-24"
 *                     nombre: "Remera"
 *                   color:
 *                     id: 1
 *                     nombre: "Rojo"
 *                   talle:
 *                     id: 1
 *                     nombre: "M"
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             examples:
 *               productoNoAsociado:
 *                 summary: Producto no asociado a la prefactura
 *                 value:
 *                   message: "El producto Remera de color Rojo y talle M no esta asociado a la prefactura."
 *               productosRepetidos:
 *                 summary: Productos repetidos
 *                 value:
 *                   - atributo: productos
 *                     mensaje: "No se pueden repetir productos en una misma prefactura"
 */
router.put(
  "/",
  validatePreFacturaProductoSchema,
  validatePreFacturaProductoExistence,
  validateStockProductoExistsByIds,
  editPreFacturaProducto
);

//3. Eliminar productos de una prefactura por ID VERIFICADO SWAGGER DOCUMENTADO
/**
 * @swagger
 * /api/preFacturaProductos:
 *   delete:
 *     summary: Eliminar productos de una prefactura
 *     tags: [PreFacturaProducto]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productos:
 *                 type: array
 *                 description: Lista de productos 
 *                 items:
 *                   type: object
 *                   properties:
 *                     productoId:
 *                       type: string
 *                       description: ID del producto con formato RPPRO XX-XX
 *                     talleId:
 *                       type: integer
 *                       description: ID del talle (mínimo 1)
 *                       minimum: 1
 *                     colorId:
 *                       type: integer
 *                       description: ID del color (mínimo 1)
 *                       minimum: 1
 *                   required:
 *                     - productoId
 *                     - talleId
 *                     - colorId
 *               preFacturaId:
 *                 type: integer
 *                 description: ID de la prefactura (mínimo 1)
 *                 minimum: 1
 *             required:
 *               - productos
 *               - preFacturaId
 *             example:
 *               productos:
 *                 - productoId: "RPPRO 01-23"
 *                   talleId: 1
 *                   colorId: 1
 *                 - productoId: "RPPRO 01-22"
 *                   talleId: 2
 *                   colorId: 2
 *               preFacturaId: 1
 *     responses:
 *       204:
 *         description: Productos eliminados correctamente
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             examples:
 *               productoNoAsociado:
 *                 summary: Producto no asociado a la prefactura
 *                 value:
 *                   message: "El producto Remera de color Rojo y talle M no esta asociado a la prefactura."
 *               productosRepetidos:
 *                 summary: Productos repetidos
 *                 value:
 *                   - atributo: productos
 *                     mensaje: "No se pueden repetir productos en una misma prefactura"
 */
router.delete(
  "/",
  validatePreFacturaProductoDeleteSchema,
  validatePreFacturaProductoExistence,
  validateStockProductoExistsByIds,
  deletePreFacturaProducto
);


//4. Obtener todas las prefacturas con sus productos VERIFICADO SWAGGER DOCUMENTADO
/**
 * @swagger
 * /api/preFacturaProductos:
 *   get:
 *     summary: Obtener todas las prefacturas con sus productos
 *     tags: [PreFacturaProducto]
 *     responses:
 *       200:
 *         description: Lista de prefacturas con sus productos
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 fecha: "2026-03-02T18:50:57.000Z"
 *                 cliente:
 *                   id: 1
 *                   nombre: "Juan Perez"
 *                 productos:
 *                   - cantidad: 5
 *                     producto:
 *                       id: "RPPRO 01-23"
 *                       nombre: "Remera básica"
 *                       precio: 1200
 *                     color:
 *                       id: 1
 *                       nombre: "Rojo"
 *                     talle:
 *                       id: 1
 *                       nombre: "M"
 *                   - cantidad: 10
 *                     producto:
 *                       id: "RPPRO 01-22"
 *                       nombre: "Remera básia"
 *                       precio: 1200
 *                     color:
 *                       id: 1
 *                       nombre: "Rojo"
 *                     talle:
 *                       id: 1
 *                       nombre: "M"
 *               - id: 2
 *                 fecha: "2026-03-02T18:54:36.000Z"
 *                 cliente:
 *                   id: 1
 *                   nombre: "Juan Perez"
 *                 productos:
 *                   - cantidad: 1
 *                     producto:
 *                       id: "RPPRO 01-23"
 *                       nombre: "Remera básica"
 *                       precio: 1200
 *                     color:
 *                       id: 1
 *                       nombre: "Rojo"
 *                     talle:
 *                       id: 1
 *                       nombre: "M"
 *                   - cantidad: 1
 *                     producto:
 *                       id: "RPPRO 01-22"
 *                       nombre: "Remera básia"
 *                       precio: 1200
 *                     color:
 *                       id: 1
 *                       nombre: "Rojo"
 *                     talle:
 *                       id: 1
 *                       nombre: "M"
 */
router.get("/", getAllPreFacturasWithProducts);

//5. Obtener productos de una prefactura VERIFICADO SWAGGER DOCUMENTADO
/**
 * @swagger
 * /api/preFacturaProductos/prefactura/{id}:
 *   get:
 *     summary: Obtener una prefactura con sus productos
 *     tags: [PreFacturaProducto]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la prefactura
 *     responses:
 *       200:
 *         description: Prefactura con sus productos
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               fecha: "2026-03-02T18:50:57.000Z"
 *               cliente:
 *                 id: 1
 *                 nombre: "Juan Perez"
 *               productos:
 *                 - cantidad: 10
 *                   producto:
 *                     id: "RPPRO 01-22"
 *                     nombre: "Remera básia"
 *                     precio: 1200
 *                   color:
 *                     id: 1
 *                     nombre: "Rojo"
 *                   talle:
 *                     id: 1
 *                     nombre: "M"
 *                 - cantidad: 5
 *                   producto:
 *                     id: "RPPRO 01-23"
 *                     nombre: "Remera básica"
 *                     precio: 1200
 *                   color:
 *                     id: 1
 *                     nombre: "Rojo"
 *                   talle:
 *                     id: 1
 *                     nombre: "M"
 *       404:
 *         description: Prefactura no encontrada
 *         content:
 *           application/json:
 *             example:
 *               message: "PreFactura con id 1 no existe."
 */
router.get("/prefactura/:id", 
  validatePreFacturaById,
  getPreFacturaWithProducts
);



module.exports = router;