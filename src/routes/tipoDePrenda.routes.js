const express = require("express");
const router = express.Router();
const {
  createTipoDePrenda,
  updateTipoDePrenda,
  deleteTipoDePrenda,
  getAllTipoDePrendas,
  getTipoDePrendaById,
  getTipoDePrendaByName,
} = require("../controllers/tipoDePrenda.controller");
const {
  validateTipoDePrendaSchema,
  validateTipoDePrendaById,
  validateTipoDePrendaByName,
  validateTipoDePrendaName,
} = require("../middlewares/tipoDePrenda.middleware");

/**
 * @swagger
 * components:
 *   schemas:
 *     TipoDePrenda:
 *       type: object
 *       required:
 *         - nombre
 *       properties:
 *         id:
 *           type: integer
 *           description: ID autogenerado del tipo de prenda
 *         nombre:
 *           type: string
 *           description: Nombre del tipo de prenda
 *       example:
 *         id: 1
 *         nombre: "Remera"
 */

//1. Crear un nuevo tipo de prenda VERIFICADO SWAGGER DOCUMENTADO
/**
 * @swagger
 * /api/tipoDePrendas:
 *   post:
 *     summary: Crear un nuevo tipo de prenda
 *     tags: [TipoDePrenda]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TipoDePrenda'
 *           examples:
 *             ejemplo:
 *               summary: Ejemplo de body para crear tipo de prenda
 *               value:
 *                 nombre: "Remera"
 *     responses:
 *       201:
 *         description: Tipo de prenda creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TipoDePrenda'
 *             examples:
 *               ejemplo:
 *                 summary: Ejemplo de respuesta exitosa
 *                 value:
 *                   id: 1
 *                   nombre: "Remera"
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             examples:
 *               error:
 *                 summary: Ejemplo de error de validación
 *                 value:
 *                   message: "TipoDePrenda con el nombre Remera ya esta en uso"
 *               error2:
 *                 summary: Otro ejemplo de error de validación
 *                 value:
 *                   - atributo: "nombre"
 *                     mensaje: "\"nombre\" es obligatorio"
 *                   - atributo: "a"
 *                     mensaje: "\"a\" is not allowed"
 */
router.post(
  "/",
  validateTipoDePrendaSchema,
  validateTipoDePrendaName,
  createTipoDePrenda,
);

//2. modificar un tipo de prenda existente VERIFICADO SWAGGER DOCUMENTADO
/**
 * @swagger
 * /api/tipoDePrendas/{id}:
 *   put:
 *     summary: Modificar un tipo de prenda existente
 *     tags: [TipoDePrenda]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del tipo de prenda
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TipoDePrenda'
 *           example:
 *             nombre: "Camisa"
 *     responses:
 *       200:
 *         description: Tipo de prenda actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TipoDePrenda'
 *             example:
 *               id: 1
 *               nombre: "Camisa"
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             examples:
 *               error:
 *                 summary: Ejemplo de error de validación
 *                 value:
 *                   message: "TipoDePrenda con el nombre Remera ya esta en uso"
 *               error2:
 *                 summary: Otro ejemplo de error de validación
 *                 value:
 *                   - atributo: "nombre"
 *                     mensaje: "\"nombre\" es obligatorio"
 *                   - atributo: "a"
 *                     mensaje: "\"a\" is not allowed"
 *       404:
 *         description: Tipo de prenda no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "TipoDePrenda con id 99 no existe"
 */
router.put(
  "/:id",
  validateTipoDePrendaName,
  validateTipoDePrendaById,
  updateTipoDePrenda,
);

//3. eliminar un tipo de prenda VERIFICADO SWAGGER DOCUMENTADO
/**
 * @swagger
 * /api/tipoDePrendas/{id}:
 *   delete:
 *     summary: Eliminar un tipo de prenda
 *     tags: [TipoDePrenda]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del tipo de prenda
 *     responses:
 *       204:
 *         description: Tipo de prenda eliminado
 *       404:
 *         description: Tipo de prenda no encontrado
 *         content:
 *           application/json:
 *             examples:
 *               error:
 *                 summary: Ejemplo de error de no encontrado
 *                 value:
 *                   message: "TipoDePrenda con id 99 no existe"
 */
router.delete("/:id", validateTipoDePrendaById, deleteTipoDePrenda);

//4. obtener tipos de prendas VERIFICADO SWAGGER DOCUMENTADO
/**
 * @swagger
 * /api/tipoDePrendas:
 *   get:
 *     summary: Obtener todos los tipos de prendas
 *     tags: [TipoDePrenda]
 *     responses:
 *       200:
 *         description: Lista de tipos de prendas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TipoDePrenda'
 *             examples:
 *               ejemplo:
 *                 summary: Ejemplo de respuesta exitosa
 *                 value:
 *                   - id: 1
 *                     nombre: "Remera"
 *                   - id: 2
 *                     nombre: "Camisa"
 */
router.get("/", getAllTipoDePrendas);

//5. obtener un tipo de prenda por id VERIFICADO SWAGGER DOCUMENTADO
/**
 * @swagger
 * /api/tipoDePrendas/{id}:
 *   get:
 *     summary: Obtener un tipo de prenda por ID
 *     tags: [TipoDePrenda]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del tipo de prenda
 *     responses:
 *       200:
 *         description: Tipo de prenda encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TipoDePrenda'
 *             examples:
 *               ejemplo:
 *                 summary: Ejemplo de respuesta exitosa
 *                 value:
 *                   id: 1
 *                   nombre: "Remera"
 *       404:
 *         description: Tipo de prenda no encontrado
 *         content:
 *           application/json:
 *             examples:
 *               error:
 *                 summary: Ejemplo de error de no encontrado
 *                 value:
 *                   message: "TipoDePrenda con id 99 no existe"
 */
router.get("/:id", validateTipoDePrendaById, getTipoDePrendaById);

//6. obtener un tipo de prenda por nombre VERIFICADO SWAGGER DOCUMENTADO
/**
 * @swagger
 * /api/tipoDePrendas/nombre/{nombre}:
 *   get:
 *     summary: Obtener un tipo de prenda por nombre
 *     tags: [TipoDePrenda]
 *     parameters:
 *       - in: path
 *         name: nombre
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre del tipo de prenda
 *     responses:
 *       200:
 *         description: Tipo de prenda encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TipoDePrenda'
 *             examples:
 *               ejemplo:
 *                 summary: Ejemplo de respuesta exitosa
 *                 value:
 *                   - id: 1
 *                     nombre: "Remera"
 *       404:
 *         description: Tipo de prenda no encontrado
 *         content:
 *           application/json:
 *             examples:
 *               error:
 *                 summary: Ejemplo de error de no encontrado
 *                 value:
 *                   message: "TipoDePrenda con nombre Pantalón no existe"
 */
router.get(
  "/nombre/:nombre",
  validateTipoDePrendaByName,
  getTipoDePrendaByName,
);

module.exports = router;