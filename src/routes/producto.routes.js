const express = require("express");
const router = express.Router();
const {
  validateProductoSchema,
  validateProductoUpdateSchema,
  validateProductoById,
  validateProductoName,
  validateProductoByName,
  validateProductId
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
 *           type: string
 *           description: ID único del producto con formato RPPRO XX-XX
 *           example: "RPPRO 01-23"
 *         nombre:
 *           type: string
 *           description: Nombre del producto
 *           example: "Remera básica"
 *         precio:
 *           type: integer
 *           description: Precio del producto
 *           example: 1200
 *         tipoDePrendaId:
 *           type: string
 *           nullable: true
 *           description: ID del tipo de prenda asociado
 *           example: "tipo123"
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
 *               - id
 *               - nombre
 *               - precio
 *               - colorYTalle
 *               - tipoDePrenda
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID único del producto con formato RPPRO XX-XX
 *                 example: "RPPRO 01-23"
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
 *             id: "RPPRO 01-23"
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
 *               id: "RPPRO 01-23"
 *               nombre: "Remera básica"
 *               precio: 1200
 *               tipoDePrendaId: 1
 *               stockProductos:
 *                 - stock: 50
 *                   color:
 *                     nombre: "Rojo"
 *                   talle:
 *                     nombre: "M"
 *                 - stock: 30
 *                   color:
 *                     nombre: "Azul"
 *                   talle:
 *                     nombre: "L"
 *               tipoDePrenda:
 *                 id: 1
 *                 nombre: "Camisa"
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             examples:
 *               error:
 *                 summary: Ejemplo de error de validación
 *                 value:
 *                   message: "Producto con el nombre Remera Básica ya está en uso"
 *               error2:
 *                 summary: Otro ejemplo de error de validación
 *                 value:
 *                   - atributo: "nombre"
 *                     mensaje: "\"nombre\" es obligatorio"
 *                   - atributo: "precio"
 *                     mensaje: "\"precio\" debe ser un número entero"
 */
router.post("/", 
  validateProductoSchema, 
  validateProductId,
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
 *           type: string
 *           description: ID único del producto con formato RPPRO XX-XX
 *         required: true
 *         example: "RPPRO 01-23"
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
 *               id: "RPPRO 01-23"
 *               nombre: "Remera"
 *               precio: 100
 *               tipoDePrenda:
 *                 id: 2
 *                 nombre: "Remera doble"
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
 *           type: string
 *           description: ID único del producto con formato RPPRO XX-XX
 *         required: true
 *         example: "RPPRO 01-23"
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
 *         description: Lista de productos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Producto'
 *             example:
 *               - id: "RPPRO 01-22"
 *                 nombre: "Remera básia"
 *                 precio: 1200
 *                 stockProductos:
 *                   - stock: 30
 *                     color:
 *                       nombre: "Azul"
 *                     talle:
 *                       nombre: "L"
 *                   - stock: 50
 *                     color:
 *                       nombre: "Rojo"
 *                     talle:
 *                       nombre: "M"
 *                 tipoDePrenda:
 *                   id: 1
 *                   nombre: "Camisa"
 *               - id: "RPPRO 01-23"
 *                 nombre: "Remera básica"
 *                 precio: 1200
 *                 stockProductos:
 *                   - stock: 30
 *                     color:
 *                       nombre: "Azul"
 *                     talle:
 *                       nombre: "L"
 *                   - stock: 50
 *                     color:
 *                       nombre: "Rojo"
 *                     talle:
 *                       nombre: "M"
 *                 tipoDePrenda:
 *                   id: 1
 *                   nombre: "Camisa"
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
 *           type: string
 *           description: ID único del producto con formato RPPRO XX-XX
 *         required: true
 *         example: "RPPRO 01-23"
 *     responses:
 *       200:
 *         description: Producto obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 *             example:
 *               id: "RPPRO 01-23"
 *               nombre: "Remera básica"
 *               precio: 1200
 *               stockProductos:
 *                 - stock: 50
 *                   color:
 *                     nombre: "Rojo"
 *                   talle:
 *                     nombre: "M"
 *                 - stock: 30
 *                   color:
 *                     nombre: "Azul"
 *                   talle:
 *                     nombre: "L"
 *               tipoDePrenda:
 *                 id: 1
 *                 nombre: "Camisa"
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
 *         description: Producto obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 *             example:
 *               id: "RPPRO 01-23"
 *               nombre: "Remera básica"
 *               precio: 1200
 *               stockProductos:
 *                 - stock: 50
 *                   color:
 *                     nombre: "Rojo"
 *                   talle:
 *                     nombre: "M"
 *                 - stock: 30
 *                   color:
 *                     nombre: "Azul"
 *                   talle:
 *                     nombre: "L"
 *               tipoDePrenda:
 *                 id: 1
 *                 nombre: "Camisa"
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
