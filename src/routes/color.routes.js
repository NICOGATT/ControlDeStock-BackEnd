const express = require("express");
const router = express.Router();
const {
  createColor,
  updateColor,
  deleteColor,
  getAllColor,
  getColorById,
  getColorByName,
} = require("../controllers/color.controller");

const {
  validateColorSchema,
  validateColorById,
  validateColorByName,
  validateColorName,
} = require("../middlewares/color.middleware");

/**
 * @swagger
 * components:
 *   schemas:
 *     Color:
 *       type: object
 *       required:
 *         - nombre
 *       properties:
 *         id:
 *           type: integer
 *           description: ID autoincremental del color
 *         nombre:
 *           type: string
 *           description: Nombre del color
 *           unique: true
 *       example:
 *         id: 1
 *         nombre: "Rojo"
 */

//1. Crear un nuevo color
/**
 * @swagger
 * /api/colores:
 *   post:
 *     summary: Crear un nuevo color
 *     tags: [Colores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Color'
 *           example:
 *             nombre: "Azul"
 *     responses:
 *       201:
 *         description: Color creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Color'
 *             example:
 *               id: 2
 *               nombre: "Azul"
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Color con el nombre Azul ya está en uso"
 */
router.post("/", validateColorSchema, validateColorName, createColor);

//2. Actualizar un color por ID
/**
 * @swagger
 * /api/colores/{id}:
 *   put:
 *     summary: Actualizar un color por ID
 *     tags: [Colores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del color
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Color'
 *           example:
 *             nombre: "Verde"
 *     responses:
 *       200:
 *         description: Color actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Color'
 *             example:
 *               id: 1
 *               nombre: "Verde"
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
 *         description: Color no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Color con id 99 no existe"
 */
router.put(
  "/:id",
  validateColorSchema,
  validateColorById,
  validateColorName,
  updateColor,
);

//3. Eliminar un color por ID
/**
 * @swagger
 * /api/colores/{id}:
 *   delete:
 *     summary: Eliminar un color por ID
 *     tags: [Colores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del color
 *     responses:
 *       204:
 *         description: Color eliminado exitosamente
 *       404:
 *         description: Color no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Color con id 99 no existe"
 */
router.delete("/:id", validateColorById, deleteColor);

//4. Obtener todos los colores
/**
 * @swagger
 * /api/colores:
 *   get:
 *     summary: Obtener todos los colores
 *     tags: [Colores]
 *     responses:
 *       200:
 *         description: Lista de colores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Color'
 *             example:
 *               - id: 1
 *                 nombre: "Rojo"
 *               - id: 2
 *                 nombre: "Azul"
 */
router.get("/", getAllColor);

//5. Obtener un color por ID
/**
 * @swagger
 * /api/colores/{id}:
 *   get:
 *     summary: Obtener un color por ID
 *     tags: [Colores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del color
 *     responses:
 *       200:
 *         description: Color encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Color'
 *             example:
 *               id: 1
 *               nombre: "Rojo"
 *       404:
 *         description: Color no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Color con id 99 no existe"
 */
router.get("/:id", validateColorById, getColorById);

//6. Buscar colores por nombre
/**
 * @swagger
 * /api/colores/nombre/{nombre}:
 *   get:
 *     summary: Buscar colores por nombre
 *     tags: [Colores]
 *     parameters:
 *       - in: path
 *         name: nombre
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre del color
 *     responses:
 *       200:
 *         description: Lista de colores con ese nombre
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Color'
 *             example:
 *               - id: 1
 *                 nombre: "Rojo"
 *       404:
 *         description: Color no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Color con nombre Violeta no existe"
 */
router.get("/nombre/:nombre", validateColorByName, getColorByName);

module.exports = router;
