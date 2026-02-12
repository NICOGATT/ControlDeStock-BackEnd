const express = require("express");
const router = express.Router();
const {
  createTalle,
  updateTalle,
  deleteTalle,
  getAllTalles,
  getTalleById,
  getTalleByName
} = require("../controllers/talle.controller");

const {
  validateTalleSchema,
  validateTalleById,
  validateTalleByName,
  validateTalleName,
} = require("../middlewares/talle.middleware");

/**
 * @swagger
 * components:
 *   schemas:
 *     Talle:
 *       type: object
 *       required:
 *         - nombre
 *       properties:
 *         id:
 *           type: integer
 *           description: ID autoincremental del talle
 *         nombre:
 *           type: string
 *           description: Nombre del talle
 *           unique: true
 *       example:
 *         id: 1
 *         nombre: "M"
 */

//1. Crear un nuevo talle VERIFICADO
/**
 * @swagger
 * /api/talles:
 *   post:
 *     summary: Crear un nuevo talle
 *     tags: [Talles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Talle'
 *           example:
 *             nombre: "XL"
 *     responses:
 *       201:
 *         description: Talle creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Talle'
 *             example:
 *               id: 2
 *               nombre: "XL"
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
 *               message: "Talle con el nombre XL ya esta en uso"
 */
router.post(
  "/",
  validateTalleSchema,
  validateTalleName,
  createTalle
);

//2. Actualizar un talle por ID VERIFICADO
/**
 * @swagger
 * /api/talles/{id}:
 *   put:
 *     summary: Actualizar un talle por ID
 *     tags: [Talles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del talle
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Talle'
 *           example:
 *             nombre: "L"
 *     responses:
 *       200:
 *         description: Talle actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Talle'
 *             example:
 *               id: 1
 *               nombre: "L"
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
 *         description: Talle no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Talle con id 99 no existe"
 */
router.put(
  "/:id",
  validateTalleSchema,
  validateTalleById,
  validateTalleName,
  updateTalle
);

//3. Eliminar un talle por ID VERIFICADO
/**
 * @swagger
 * /api/talles/{id}:
 *   delete:
 *     summary: Eliminar un talle por ID
 *     tags: [Talles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del talle
 *     responses:
 *       204:
 *         description: Talle eliminado exitosamente
 *       404:
 *         description: Talle no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Talle con id 99 no existe"
 */
router.delete("/:id", 
  validateTalleById, 
  deleteTalle
);

//4. Obtener todos los talles VERIFICADO
/**
 * @swagger
 * /api/talles:
 *   get:
 *     summary: Obtener todos los talles
 *     tags: [Talles]
 *     responses:
 *       200:
 *         description: Lista de talles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Talle'
 *             example:
 *               - id: 1
 *                 nombre: "M"
 *               - id: 2
 *                 nombre: "XL"
 */
router.get("/", getAllTalles);

//5. Obtener un talle por ID VERIFICADO
/**
 * @swagger
 * /api/talles/{id}:
 *   get:
 *     summary: Obtener un talle por ID
 *     tags: [Talles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del talle
 *     responses:
 *       200:
 *         description: Talle encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Talle'
 *             example:
 *               id: 1
 *               nombre: "M"
 *       404:
 *         description: Talle no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Talle con id 99 no existe"
 */
router.get("/:id", 
  validateTalleById, 
  getTalleById
);

//6. Buscar talles por nombre VERIFICADO
/**
 * @swagger
 * /api/talles/nombre/{nombre}:
 *   get:
 *     summary: Buscar talles por nombre
 *     tags: [Talles]
 *     parameters:
 *       - in: path
 *         name: nombre
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre del talle
 *     responses:
 *       200:
 *         description: Lista de talles con ese nombre
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Talle'
 *             example:
 *               - id: 1
 *                 nombre: "M"
 *       404:
 *         description: Talle no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Talle con nombre XS no existe"
 */
router.get(
  "/nombre/:nombre",
  validateTalleByName,
  getTalleByName,
);

module.exports = router;
