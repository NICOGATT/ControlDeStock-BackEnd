const express = require("express");
const router = express.Router();
const {
  validateProductoSchema,
  validateProductoUpdateSchema,
  validateProductoById,
  validateProductoName,
} = require("../middlewares/producto.middleware");
const {
  createProducto,
  updateProducto,
  deleteModel,
  getAllProductos,
  getProductoById,
} = require("../controllers/producto.controller");
/**
 * @swagger
 * tags:
 *   name: Productos
 * components:
 *   schemas:
 *     Producto:
 *       type: object
 *       required:
 *         - nombre
 *         - cantidad
 *         - precio
 *         - color
 *         - talle
 *         - tipoDePrenda
 *       properties:
 *         id:
 *           type: integer
 *           description: ID autogenerado del producto
 *           example: 1
 *         nombre:
 *           type: string
 *           description: Nombre del producto
 *           example: "Remera básica"
 *         cantidad:
 *           type: integer
 *           description: Cantidad disponible
 *           example: 50
 *         precio:
 *           type: integer
 *           description: Precio del producto
 *           example: 1200
 *         color:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *               description: Nombre del color
 *               example: "Rojo"
 *         talle:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *               description: Nombre del talle
 *               example: "M"
 *         tipoDePrenda:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *               description: Nombre del tipo de prenda
 *               example: "Remera"
 */

//1. Crear un nuevo producto VERIFICADO
/**
 * @swagger
 * /api/productos:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - cantidad
 *               - precio
 *               - color
 *               - talle
 *               - tipoDePrenda
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del producto
 *                 example: "Remera básica"
 *               cantidad:
 *                 type: integer
 *                 description: Cantidad disponible
 *                 example: 50
 *               precio:
 *                 type: integer
 *                 description: Precio del producto
 *                 example: 1200
 *               color:
 *                 type: object
 *                 properties:
 *                   nombre:
 *                     type: string
 *                     description: Nombre del color
 *                     example: "Rojo"
 *               talle:
 *                 type: object
 *                 properties:
 *                   nombre:
 *                     type: string
 *                     description: Nombre del talle
 *                     example: "M"
 *               tipoDePrenda:
 *                 type: object
 *                 properties:
 *                   nombre:
 *                     type: string
 *                     description: Nombre del tipo de prenda
 *                     example: "Remera"
 *           example:
 *             nombre: "Remera básica"
 *             cantidad: 50
 *             precio: 1200
 *             color: { nombre: "Rojo" }
 *             talle: { nombre: "M" }
 *             tipoDePrenda: { nombre: "Remera" }
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 *             example:
 *               id: 1
 *               nombre: "Remera básica"
 *               cantidad: 50
 *               precio: 1200
 *               color: { nombre: "Rojo" }
 *               talle: { nombre: "M" }
 *               tipoDePrenda: { nombre: "Remera" }
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             example:
 *               message: "Producto con el nombre Remera ya esta en uso"
 */
router.post("/", 
  validateProductoSchema, 
  validateProductoName, 
  createProducto
);

//2. Actualizar un producto por su ID VERIFICADO
/**
 * @swagger
 * /api/productos/{id}:
 *   put:
 *     summary: Actualizar un producto por ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Producto'
 *           example:
 *             nombre: "Remera básica"
 *             cantidad: 100
 *             precio: 1500
 *             color:
 *               nombre: "Azul"
 *             talle:
 *               nombre: "L"
 *             tipoDePrenda:
 *               nombre: "Camisa"
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 *             example:
 *               id: 1
 *               nombre: "Remera básica"
 *               cantidad: 100
 *               precio: 1500
 *               color:
 *                 nombre: "Azul"
 *               talle:
 *                 nombre: "L"
 *               tipoDePrenda:
 *                 nombre: "Camisa"
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             example:
 *               - atributo: "nombre"
 *                 mensaje: "\"nombre\" ya está en uso"
 *               - atributo: "nombre"
 *                 mensaje: "El campo nombre es requerido"
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             example:
 *               message: "Producto con id 1 no existe"
 */
router.put(
  "/:id",
  validateProductoById,
  validateProductoUpdateSchema,
  validateProductoName,
  updateProducto,
);

//3. Eliminar un producto por su ID VERIFICADO
/**
 * @swagger
 * /api/productos/{id}:
 *   delete:
 *     summary: Eliminar un producto por su ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del producto
 *     responses:
 *       204:
 *         description: Producto eliminado exitosamente
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             example:
 *               message: "Producto con id 1 no existe"
 */
router.delete("/:id", 
  validateProductoById, 
  deleteModel
);

//4. Obtener todos los productos VERIFICADO
/**
 * @swagger
 * /api/productos:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Producto'
 *             example:
 *               - id: 1
 *                 nombre: "Remera básica"
 *                 cantidad: 50
 *                 precio: 1200
 *                 color: { nombre: "Rojo" }
 *                 talle: { nombre: "M" }
 *                 tipoDePrenda: { nombre: "Remera" }
 *               - id: 2
 *                 nombre: "Pantalón jean"
 *                 cantidad: 30
 *                 precio: 2500
 *                 color: { nombre: "Azul" }
 *                 talle: { nombre: "L" }
 *                 tipoDePrenda: { nombre: "Pantalón" }
 */
router.get("/", getAllProductos);

//5. Obtener un producto por su ID VERIFICADO
/**
 * @swagger
 * /api/productos/{id}:
 *   get:
 *     summary: Obtener un producto por su ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 *             example:
 *               id: 1
 *               nombre: "Remera básica"
 *               cantidad: 50
 *               precio: 1200
 *               color: { nombre: "Rojo" }
 *               talle: { nombre: "M" }
 *               tipoDePrenda: { nombre: "Remera" }
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             example:
 *               message: "Producto con id 1 no existe"
 */
router.get("/:id", 
  validateProductoById, 
  getProductoById
);

module.exports = router;
