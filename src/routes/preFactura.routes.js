const express = require('express');
const router = express.Router();
const {
  validatePreFacturaSchema,
  validatePreFacturaById,
  validateDate,
  validateCliente
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
 *         telefono:
 *           type: string
 *           description: Teléfono del cliente asociado a la preFactura
 *       example:
 *         id: 1
 *         cliente: 2
 *         fecha: "2024-06-01T12:00:00.000Z"
 *         telefono: "123456789"
 */

//1. Crear una nueva preFactura VERIFICADO SWAGGER DOCUMENTADO
/**
 * @swagger
 * /api/preFacturas:
 *   post:
 *     summary: Crear una nueva preFactura
 *     tags: [PreFacturas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cliente:
 *                 type: string
 *                 description: Nombre del cliente
 *               telefono:
 *                 type: string
 *                 description: Teléfono del cliente (10 dígitos)
 *               direccion:
 *                 type: string
 *                 description: Dirección del cliente
 *               codigoPostal:
 *                 type: string
 *                 description: Código postal (4-5 dígitos)
 *               ciudad:
 *                 type: string
 *                 description: Ciudad
 *               provincia:
 *                 type: string
 *                 description: Provincia
 *               cuit:
 *                 type: string
 *                 description: CUIT en formato XX-XXXXXXXX-X
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email del cliente
 *               nombreEmpresa:
 *                 type: string
 *                 description: Nombre de la empresa
 *               condicionTributaria:
 *                 type: string
 *                 description: Condición tributaria del cliente
 *             required:
 *               - cliente
 *               - telefono
 *               - direccion
 *               - codigoPostal
 *               - ciudad
 *               - provincia
 *               - cuit
 *               - email
 *               - nombreEmpresa
 *               - condicionTributaria
 *           example:
 *             cliente: "Juan Perez"
 *             telefono: "1234567890"
 *             direccion: "Av. Libertad 123"
 *             codigoPostal: "1425"
 *             ciudad: "Buenos Aires"
 *             provincia: "Buenos Aires"
 *             cuit: "20-15678901-2"
 *             email: "juan@example.com"
 *             nombreEmpresa: "Perez SRL"
 *             condicionTributaria: "Responsable Inscripto"
 *     responses:
 *       201:
 *         description: PreFactura creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID de la preFactura
 *                 cliente:
 *                   type: object
 *                   properties:
 *                     nombre:
 *                       type: string
 *                     telefono:
 *                       type: string
 *                     email:
 *                       type: string
 *                     cuit:
 *                       type: string
 *                     nombreEmpresa:
 *                       type: string
 *                     condicionTributaria:
 *                       type: string
 *                 fecha:
 *                   type: string
 *                   format: date-time
 *                   description: Fecha de creación
 *                 direccion:
 *                   type: object
 *                   properties:
 *                     direccion:
 *                       type: string
 *                     codigoPostal:
 *                       type: string
 *                     ciudad:
 *                       type: string
 *                     provincia:
 *                       type: string
 *             example:
 *               id: 3
 *               cliente:
 *                 nombre: "Juan Perez"
 *                 telefono: "1234567890"
 *                 email: "juan@example.com"
 *                 cuit: "20-15678901-2"
 *                 nombreEmpresa: "Perez SRL"
 *                 condicionTributaria: "Responsable Inscripto"
 *               fecha: "2026-02-22T01:33:50.000Z"
 *               direccion:
 *                 direccion: "Av. Libertad 123"
 *                 codigoPostal: "1425"
 *                 ciudad: "Buenos Aires"
 *                 provincia: "Buenos Aires"
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             example:
 *               - atributo: "cliente"
 *                 mensaje: "El cliente es obligatorio"
 *               - atributo: "telefono"
 *                 mensaje: "telefono debe ser un número de 10 dígitos"
 *               - atributo: "cuit"
 *                 mensaje: "cuit debe tener el formato XX-XXXXXXXX-X"
 */
router.post('/',
  validatePreFacturaSchema,
  createPreFactura
);

//2. Eliminar una preFactura por ID VERIFICADO
/**
 * @swagger
 * /api/preFacturas/{id}:
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

//3. Obtener preFacturas VERIFICADO SWAGGER DOCUMENTADO
/**
 * @swagger
 * /api/preFacturas:
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
 *             example:
 *               - id: 1
 *                 fecha: "2026-02-17T19:47:09.000Z"
 *                 cliente:
 *                   nombre: "Juan Perez"
 *                   telefono: "1234567890"
 *               - id: 2
 *                 fecha: "2026-02-17T19:47:11.000Z"
 *                 cliente:
 *                   nombre: "Juan Perez"
 *                   telefono: "1234567890"
 */
router.get('/', 
  getAllPreFacturas
);

//4. Obtener una preFactura por ID VERIFICADO
/**
 * @swagger
 * /api/preFacturas/{id}:
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
 *             example:
 *               id: 1
 *               fecha: "2026-02-17T19:47:09.000Z"
 *               cliente:
 *                 nombre: "Juan Perez"
 *                 telefono: "1234567890"
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
 * /api/preFacturas/cliente/{nombre}:
 *   get:
 *     summary: Obtener todas las preFacturas de un cliente
 *     tags: [PreFacturas]
 *     parameters:
 *       - in: path
 *         name: nombre
 *         schema:
 *           type: string
 *         required: true
 *         description: nombre del cliente
 *     responses:
 *       200:
 *         description: Lista de preFacturas del cliente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PreFactura'
 *             example:
 *               - id: 1
 *                 fecha: "2026-02-17T19:47:09.000Z"
 *                 cliente:
 *                   nombre: "Juan Perez"
 *                   telefono: "1234567890"
 *       404:
 *         description: Cliente no encontrado
 */
router.get('/cliente/:nombre', 
  validateCliente,
  getPreFacturasByClient
);

//6. Obtener preFacturas por fecha VERIFICADO
/**
 * @swagger
 * /api/preFacturas/fecha/{fecha}:
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
 *             example:
 *               - id: 1
 *                 fecha: "2026-02-17T19:47:09.000Z"
 *                 cliente:
 *                   nombre: "Juan Perez"
 *                   telefono: "1234567890"
 *               - id: 3
 *                 fecha: "2026-02-17T19:56:57.000Z"
 *                 cliente:
 *                   nombre: "Juan Perez"
 *                   telefono: "1234567890"
 *       404:
 *         description: No se encontraron preFacturas en esa fecha
 */
router.get('/fecha/:fecha', 
  validateDate,
  getPreFacturasByDate
);

module.exports = router;

