const express = require("express");
const router = express.Router();
const {
  validateProductoSchema,
  validateProductoUpdateSchema,
  validateProductoById,
  validateProductoName,
  validateProductoByName
} = require("../middlewares/producto.middleware");
const {
  createProducto,
  updateProducto,
  deleteModel,
  getAllProductos,
  getProductoById,
  getProductoByName
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
 *         - precio
 *       properties:
 *         id:
 *           type: integer
 *           description: ID autogenerado del producto
 *           example: 1
 *         nombre:
 *           type: string
 *           description: Nombre del producto
 *           example: "Remera básica"
 *         precio:
 *           type: integer
 *           description: Precio del producto
 *           example: 1200
 *         tipoDePrendaId:
 *           type: integer
 *           nullable: true
 *           description: ID del tipo de prenda asociado
 *           example: 1
 */

//1. Crear un nuevo producto VERIFICADO SWAGGER DOCUMENTADO
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
 *               - precio
 *               - colorYTalle
 *               - tipoDePrenda
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del producto
 *                 example: "Remera básica"
 *               precio:
 *                 type: integer
 *                 description: Precio del producto
 *                 example: 1200
 *               colorYTalle:
 *                 type: array
 *                 description: Lista de combinaciones de colores y talles
 *                 items:
 *                   type: object
 *                   required:
 *                     - color
 *                     - talle
 *                     - cantidad
 *                   properties:
 *                     color:
 *                       type: string
 *                       description: Nombre del color
 *                       example: "Rojo"
 *                     talle:
 *                       type: string
 *                       description: Nombre del talle
 *                       example: "M"
 *                     cantidad:
 *                       type: integer
 *                       description: Cantidad disponible para esta combinación
 *                       example: 50
 *               tipoDePrenda:
 *                 type: string
 *                 description: Tipo de prenda del producto
 *                 example: "Camisa"
 *           example:
 *             nombre: "Remera básica"
 *             precio: 1200
 *             colorYTalle:
 *               - color: "Rojo"
 *                 talle: "M"
 *                 cantidad: 50
 *               - color: "Azul"
 *                 talle: "L"
 *                 cantidad: 30
 *             tipoDePrenda: "Camisa"
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
 *             examples:
 *               error:
 *                 summary: Ejemplo de error de validación
 *                 value:
 *                   message: "Producto con el nombre Remera Basica ya esta en uso"
 *               error2:
 *                 summary: Otro ejemplo de error de validación
 *                 value:
 *                   - atributo: "nombre"
 *                     mensaje: "\"nombre\" es obligatorio"
 *                   - atributo: "a"
 *                     mensaje: "\"a\" is not allowed"
 */
router.post("/", 
  validateProductoSchema, 
  validateProductoName, 
  createProducto
);

//2. Actualizar un producto por su ID VERIFICADO SWAGGER DOCUMENTADO
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
 *             nombre: "Remera"
 *             precio: 100
 *             tipoDePrenda: "Remera doble"
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
 *             examples:
 *               error:
 *                 summary: Ejemplo de error de validación
 *                 value:
 *                   message: "Producto con el nombre Remera Basica ya esta en uso"
 *               error2:
 *                 summary: Otro ejemplo de error de validación
 *                 value:
 *                   - atributo: "nombre"
 *                     mensaje: "\"nombre\" es obligatorio"
 *                   - atributo: "a"
 *                     mensaje: "\"a\" is not allowed"
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

//3. Eliminar un producto por su ID VERIFICADO SWAGGER DOCUMENTADO
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

//4. Obtener todos los productos VERIFICADO SWAGGER DOCUMENTADO
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
 *                 precio: 1200
 *                 stockProductos:
 *                   - stock: 50
 *                     color: { nombre: "Rojo" }
 *                     talle: { nombre: "M" }
 *                   - stock: 30
 *                     color: { nombre: "Azul" }
 *                     talle: { nombre: "L" }
 *                 tipoDePrenda: { id: 1, nombre: "Camisa" }
 *               - id: 2
 *                 nombre: "Remera bási"
 *                 precio: 1200
 *                 stockProductos:
 *                   - stock: 50
 *                     color: { nombre: "Rojo" }
 *                     talle: { nombre: "M" }
 *                   - stock: 30
 *                     color: { nombre: "Azul" }
 *                     talle: { nombre: "L" }
 *                 tipoDePrenda: { id: 1, nombre: "Camisa" }
 */
router.get("/", getAllProductos);

//5. Obtener un producto por su ID VERIFICADO SWAGGER DOCUMENTADO
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
 *               id: 3
 *               nombre: "Rema"
 *               precio: 10000
 *               stockProductos:
 *                 - stock: 50
 *                   color: { nombre: "Rojo" }
 *                   talle: { nombre: "M" }
 *                 - stock: 30
 *                   color: { nombre: "Azul" }
 *                   talle: { nombre: "L" }
 *               tipoDePrenda: { id: 3, nombre: "Remera dle" }
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

//6. Buscar un producto por nombre VERIFICADO SWAGGER DOCUMENTADO
/**
 * @swagger
 * /api/productos/nombre/{nombre}:
 *   get:
 *     summary: Buscar un producto por nombre
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: nombre
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre del producto a buscar
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
 *               precio: 1200
 *               stockProductos:
 *                 - stock: 50
 *                   color: { nombre: "Rojo" }
 *                   talle: { nombre: "M" }
 *                 - stock: 30
 *                   color: { nombre: "Azul" }
 *                   talle: { nombre: "L" }
 *               tipoDePrenda: { id: 1, nombre: "Camisa" }
 *       404:
 *         description: No se encontró el producto con ese nombre
 *         content:
 *           application/json:
 *             example:
 *               message: "Producto con nombre remera no existe"
 */
router.get("/nombre/:nombre", 
  validateProductoByName, 
  getProductoByName
);
module.exports = router;
