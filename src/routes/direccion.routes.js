const express = require('express');
const router = express.Router();
const {
  validateDireccionSchema,
  validateDireccionUpdateSchema,
  validateDireccionExists,
  validateDireccionNonExists,
  validateDireccionName
} = require('../middlewares/direccion.middleware');
const {
  createDireccion,
  updateDireccion,
  deleteDireccion,
  getDireccionesByCliente,
  getAllDirecciones
} = require('../controllers/direccion.controller');

/**
 * @swagger
 * components:
 *   schemas:
 *     Direccion:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID de la dirección
 *           example: 1
 *         direccion:
 *           type: string
 *           description: Dirección del cliente (única)
 *           example: "Av. Libertad 123"
 *         clienteId:
 *           type: integer
 *           description: ID del cliente al que pertenece la dirección
 *           example: 1
 *         codigoPostal:
 *           type: string
 *           description: Código postal (4 o 5 dígitos)
 *           example: "1425"
 *         ciudad:
 *           type: string
 *           description: Ciudad
 *           example: "Buenos Aires"
 *         provincia:
 *           type: string
 *           description: Provincia
 *           example: "CABA"
 *       required:
 *         - direccion
 *         - clienteId
 *         - codigoPostal
 *         - ciudad
 *         - provincia
 *     DireccionActualizar:
 *       type: object
 *       properties:
 *         direccion:
 *           type: string
 *           description: Dirección actual (requerida para identificar)
 *           example: "Av. Libertad 123"
 *         clienteId:
 *           type: integer
 *           description: ID del cliente (requerido para identificar)
 *           example: 1
 *         direccionNueva:
 *           type: string
 *           description: Nueva dirección (opcional)
 *           example: "Av. Libertad 456"
 *         codigoPostal:
 *           type: string
 *           description: Código postal (4 o 5 dígitos, opcional)
 *           example: "1426"
 *         ciudad:
 *           type: string
 *           description: Ciudad (opcional)
 *           example: "La Plata"
 *         provincia:
 *           type: string
 *           description: Provincia (opcional)
 *           example: "Buenos Aires"
 *       required:
 *         - direccion
 *         - clienteId
 */

//1. Crear una nueva dirección para un cliente VERIFICADO SWAGGER DOCUMENTADO
/**
 * @swagger
 * /api/direcciones:
 *   post:
 *     summary: Crear una nueva dirección para un cliente
 *     tags: [Direcciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Direccion'
 *           example:
 *             direccion: "Av. Libertad 123"
 *             clienteId: 1
 *             codigoPostal: "1425"
 *             ciudad: "Buenos Aires"
 *             provincia: "CABA"
 *     responses:
 *       201:
 *         description: Dirección creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Direccion'
 *             example:
 *               id: 1
 *               direccion: "Av. Libertad 123"
 *               clienteId: 1
 *               codigoPostal: "1425"
 *               ciudad: "Buenos Aires"
 *               provincia: "CABA"
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             examples:
 *               error:
 *                 summary: Dirección ya existe
 *                 value:
 *                   message: "La dirección ya existe para este cliente"
 */
router.post('/', 
  validateDireccionSchema, 
  validateDireccionNonExists,
  createDireccion
);

//2. Editar una direccion de un cliente VERIFICADO SWAGGER DOCUMENTADO
/**
 * @swagger
 * /api/direcciones:
 *   put:
 *     summary: Editar una dirección de un cliente
 *     tags: [Direcciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DireccionActualizar'
 *           example:
 *             direccion: "Av. Libertad 123"
 *             clienteId: 1
 *             direccionNueva: "Av. Libertad 456"
 *             codigoPostal: "1425"
 *             ciudad: "Buenos Aires"
 *             provincia: "CABA"
 *     responses:
 *       200:
 *         description: Dirección actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Direccion'
 *             example:
 *               id: 1
 *               direccion: "Av. Libertad 456"
 *               clienteId: 1
 *               codigoPostal: "1425"
 *               ciudad: "Buenos Aires"
 *               provincia: "CABA"
 *       404:
 *         description: Dirección no encontrada
 *         content:
 *           application/json:
 *             example:
 *               message: "La dirección no existe"
 *       400:
 *         description: La dirección nueva ya existe
 *         content:
 *           application/json:
 *             example:
 *               message: "Ya existe una direccion con ese nombre, esta asociada al cliente: Juan Perez"
 */
router.put('/', 
  validateDireccionUpdateSchema, 
  validateDireccionExists,
  validateDireccionName,
  updateDireccion
);

//3. Eliminar una direccion de un cliente
/**
 * @swagger
 * /api/direcciones:
 *   delete:
 *     summary: Eliminar una dirección de un cliente
 *     tags: [Direcciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               direccion:
 *                 type: string
 *               clienteId:
 *                 type: integer
 *           example:
 *             direccion: "Av. Libertad 123"
 *             clienteId: 1
 *     responses:
 *       204:
 *         description: Dirección eliminada exitosamente
 *       404:
 *         description: Dirección no encontrada
 *         content:
 *           application/json:
 *             example:
 *               message: "La dirección no existe"
 */
router.delete('/', 
  validateDireccionExists, 
  deleteDireccion
);

//4. Obtener todas las direcciones de un cliente VERIFICADO SWAGGER DOCUMENTADO
/**
 * @swagger
 * /api/direcciones/cliente/{clienteId}:
 *   get:
 *     summary: Obtener todas las direcciones de un cliente
 *     tags: [Direcciones]
 *     parameters:
 *       - in: path
 *         name: clienteId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Lista de direcciones del cliente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Direccion'
 *             example:
 *               - id: 1
 *                 direccion: "Av. Libertad 123"
 *                 clienteId: 1
 *                 codigoPostal: "1425"
 *                 ciudad: "Buenos Aires"
 *                 provincia: "CABA"
 *               - id: 2
 *                 direccion: "Calle Falsa 456"
 *                 clienteId: 1
 *                 codigoPostal: "1426"
 *                 ciudad: "Buenos Aires"
 *                 provincia: "CABA"
 */
router.get('/cliente/:clienteId', 
  getDireccionesByCliente
);

//5. Obtener todas las direcciones de todos los clientes VERIFICADO SWAGGER DOCUMENTADO
/**
 * @swagger
 * /api/direcciones:
 *   get:
 *     summary: Obtener todas las direcciones de todos los clientes
 *     tags: [Direcciones]
 *     responses:
 *       200:
 *         description: Lista de todas las direcciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Direccion'
 *             example:
 *               - id: 1
 *                 direccion: "Av. Libertad 123"
 *                 clienteId: 1
 *                 codigoPostal: "1425"
 *                 ciudad: "Buenos Aires"
 *                 provincia: "CABA"
 *               - id: 2
 *                 direccion: "San Martín 500"
 *                 clienteId: 2
 *                 codigoPostal: "1425"
 *                 ciudad: "Buenos Aires"
 *                 provincia: "CABA"
 */
router.get('/', 
  getAllDirecciones
);
module.exports = router;