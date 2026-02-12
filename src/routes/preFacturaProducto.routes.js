const express = require('express');
const router = express.Router();
const {
  validatePreFacturaProductoSchema,
  validatePreFacturaProductoDeleteSchema,
  validatePreFacturaProductoExistence,
  validatePreFacturaProductoNonExistence
} = require("../middlewares/preFacturaProducto.middleware");
const {
  addProductsToPreFactura,
  editPreFacturaProducto,
  deletePreFacturaProducto,
  getProductsFromPreFactura,
  getAllPreFacturasWithProducts
} = require("../controllers/preFacturaProducto.controller");

/**
 * @swagger
 * components:
 *   schemas:
 *     Producto:
 *       type: object
 *       properties:
 *         productoId:
 *           type: integer
 *           description: ID del producto
 *         cantidad:
 *           type: integer
 *           description: Cantidad del producto
 *       required:
 *         - productoId
 *         - cantidad
 *       example:
 *         productoId: 1
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

//1. Agregar productos a una prefactura VERIFICADO
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
 *                       type: integer
 *                       description: ID del producto (mínimo 1)
 *                       minimum: 1
 *                     cantidad:
 *                       type: integer
 *                       description: Cantidad del producto (mínimo 1)
 *                       minimum: 1
 *                   required:
 *                     - productoId
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
 *                 - productoId: 1
 *                   cantidad: 1
 *                 - productoId: 2
 *                   cantidad: 1
 *               preFacturaId: 1
 *     responses:
 *       201:
 *         description: Productos agregados correctamente
 *         content:
 *           application/json:
 *             example:
 *               productos:
 *                 - productoId: 1
 *                   cantidad: 1
 *                 - productoId: 2
 *                   cantidad: 1
 *               preFacturaId: 1
 *       400:
 *         description: Error de validación
 */
router.post(
  "/",
  validatePreFacturaProductoSchema,
  validatePreFacturaProductoNonExistence,
  addProductsToPreFactura
);

//2. Editar productos de una prefactura por ID VERIFICADO
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
 *                       type: integer
 *                       description: ID del producto (mínimo 1)
 *                       minimum: 1
 *                     cantidad:
 *                       type: integer
 *                       description: Cantidad del producto (mínimo 1)
 *                       minimum: 1
 *                   required:
 *                     - productoId
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
 *                 - productoId: 1
 *                   cantidad: 10
 *                 - productoId: 2
 *                   cantidad: 5
 *               preFacturaId: 1
 *     responses:
 *       200:
 *         description: Productos actualizados correctamente
 *         content:
 *           application/json:
 *             example:
 *               - preFacturaId: 1
 *                 productoId: 2
 *                 cantidad: 8
 *               - preFacturaId: 1
 *                 productoId: 3
 *                 cantidad: 12
 *       400:
 *         description: Error de validación
 */
router.put(
  "/",
  validatePreFacturaProductoSchema,
  validatePreFacturaProductoExistence,
  editPreFacturaProducto
);

//3. Eliminar productos de una prefactura por ID VERIFICADO
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
 *                       type: integer
 *                       description: ID del producto (mínimo 1)
 *                       minimum: 1
 *                   required:
 *                     - productoId
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
 *                 - productoId: 1
 *                 - productoId: 2
 *               preFacturaId: 1
 *     responses:
 *       200:
 *         description: Productos eliminados correctamente
 *         content:
 *           application/json:
 *             example:
 *               message: "Productos eliminados correctamente."
 *       400:
 *         description: Error de validación
 */
router.delete(
  "/",
  validatePreFacturaProductoDeleteSchema,
  validatePreFacturaProductoExistence,
  deletePreFacturaProducto
);


//4. Obtener todas las prefacturas con sus productos
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
 *               - preFacturaId: 1
 *                 productos:
 *                   - productoId: 1
 *                     cantidad: 5
 *                   - productoId: 2
 *                     cantidad: 3
 *               - preFacturaId: 2
 *                 productos:
 *                   - productoId: 3
 *                     cantidad: 2
 */
router.get("/", getAllPreFacturasWithProducts);

//5. Obtener productos de una prefactura
/**
 * @swagger
 * /api/preFacturaProductos/prefactura/{preFacturaId}/productos:
 *   get:
 *     summary: Obtener productos de una prefactura
 *     tags: [PreFacturaProducto]
 *     parameters:
 *       - in: path
 *         name: preFacturaId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la prefactura
 *     responses:
 *       200:
 *         description: Lista de productos de la prefactura
 *         content:
 *           application/json:
 *             example:
 *               preFacturaId: 1
 *               productos:
 *                 - productoId: 1
 *                   cantidad: 5
 *                 - productoId: 2
 *                   cantidad: 3
 *       404:
 *         description: Prefactura no encontrada
 */
router.get("/prefactura/:preFacturaId/productos", getProductsFromPreFactura);



module.exports = router;