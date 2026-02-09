const express = require('express');
const router = express.Router();
const {
  validatePreFacturaSchema,
  validatePreFacturaById,
  validateDate,
  validateClient
} = require('../middlewares/preFactura.middleware');

const {
  createPreFactura,
  deletePreFacturaById,
  getAllPreFacturas,
  getPreFacturaById,
  getPreFacturasByClient,
  getPreFacturasByDate
} = require('../controllers/preFactura.controller');

/**
 * @swagger
 * components:
 *   schemas:
 *     PreFactura:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID autogenerado de la preFactura
 *         clienteId:
 *           type: integer
 *           description: ID del cliente asociado a la preFactura
 *         fecha:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación de la preFactura
 *       example:
 *         id: 1
 *         cliente: 2
 *         fecha: "2024-06-01T12:00:00.000Z"
 */

//1. Crear una nueva preFactura VERIFICADO
/**
 * @swagger
 * /api/preFactura:
 *   post:
 *     summary: Crear una nueva preFactura
 *     tags: [PreFacturas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PreFacturaRequest'
 *     responses:
 *       201:
 *         description: PreFactura creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PreFactura'
 */
router.post('/',
  validatePreFacturaSchema,
  createPreFactura
);

//2. Eliminar una preFactura por ID VERIFICADO
/**
 * @swagger
 * /api/preFactura/{id}:
 *   delete:
 *     summary: Eliminar una preFactura por ID
 *     tags: [PreFacturas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la preFactura
 *     responses:
 *       204:
 *         description: PreFactura eliminada exitosamente
 *       404:
 *         description: PreFactura no encontrada
 */
router.delete('/:id',
  validatePreFacturaById,
  deletePreFacturaById
);

//3. Obtener preFacturas VERIFICADO
/**
 * @swagger
 * /api/preFactura:
 *   get:
 *     summary: Obtener todas las preFacturas
 *     tags: [PreFacturas]
 *     responses:
 *       200:
 *         description: Lista de preFacturas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PreFactura'
 */
router.get('/', 
  getAllPreFacturas
);

//4. Obtener una preFactura por ID VERIFICADO
/**
 * @swagger
 * /api/preFactura/{id}:
 *   get:
 *     summary: Obtener una preFactura por ID
 *     tags: [PreFacturas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la preFactura
 *     responses:
 *       200:
 *         description: PreFactura encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PreFactura'
 *       404:
 *         description: PreFactura no encontrada
 */
router.get('/:id',
  validatePreFacturaById,
  getPreFacturaById
);

//5. Obtener preFacturas por cliente VERIFICADO
/**
 * @swagger
 * /api/preFactura/cliente/{cliente}:
 *   get:
 *     summary: Obtener todas las preFacturas de un cliente
 *     tags: [PreFacturas]
 *     parameters:
 *       - in: path
 *         name: cliente
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre del cliente
 *     responses:
 *       200:
 *         description: Lista de preFacturas del cliente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PreFactura'
 *       404:
 *         description: Cliente no encontrado
 */
router.get('/cliente/:cliente', 
  validateClient,
  getPreFacturasByClient
);

//6. Obtener preFacturas por fecha VERIFICADO
/**
 * @swagger
 * /api/preFactura/fecha/{fecha}:
 *   get:
 *     summary: Obtener todas las preFacturas en una fecha específica
 *     tags: [PreFacturas]
 *     parameters:
 *       - in: path
 *         name: fecha
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Fecha en formato ISO (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lista de preFacturas en la fecha dada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PreFactura'
 *       404:
 *         description: No se encontraron preFacturas en esa fecha
 */
router.get('/fecha/:fecha', 
  validateDate,
  getPreFacturasByDate
);

module.exports = router;

