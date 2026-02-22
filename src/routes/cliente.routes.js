const express = require('express');
const router = express.Router();
const {
  validateClienteSchema,
  validateClienteUpdateSchema,
  validateClienteById,
  validateClienteByName,
  validateClienteName
} = require("../middlewares/cliente.middleware");
const {
  validateDireccionNonExists,
} = require("../middlewares/direccion.middleware");
const {
  createCliente,
  updateCliente,
  deleteCliente,
  getClienteById,
  getAllClientes,
  getClienteByName
} = require('../controllers/cliente.controller');

/**
 * @swagger
 * components:
 *   schemas:
 *     Cliente:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           description: Nombre del cliente
 *           example: "Juan Perez"
 *         telefono:
 *           type: string
 *           description: Teléfono del cliente (10 dígitos)
 *           example: "1123456789"
 *         direccion:
 *           type: string
 *           description: Dirección del cliente
 *           example: "Av. Libertad 123"
 *       required:
 *         - nombre
 *         - telefono
 *         - direccion
 */

//1. Crear un nuevo cliente VERIFICADO SWAGGER DOCUMENTADO
/**
 * @swagger
 * /api/clientes:
 *   post:
 *     summary: Crear un nuevo cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *           example:
 *             nombre: "Juan Perez"
 *             telefono: "1123456789"
 *             direccion: "Av. Libertad 123"
 *     responses:
 *       201:
 *         description: Cliente creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *             example:
 *               id: 1
 *               nombre: "Juan Perez"
 *               telefono: "1123456789"
 *               direccion: "Av. Libertad 123"
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             examples:
 *               error:
 *                 summary: Ejemplo de error de validación
 *                 value:
 *                   message: "Cliente con el nombre Patitas ya esta en uso"
 *               error2:
 *                 summary: Otro ejemplo de error de validación
 *                 value:
 *                   - atributo: "nombre"
 *                     mensaje: "\"nombre\" es obligatorio"
 *                   - atributo: "a"
 *                     mensaje: "\"a\" is not allowed"
 */
router.post('/',
  validateClienteSchema,
  validateClienteName,
  validateDireccionNonExists, 
  createCliente
);

//2. Modificar un cliente existente VERIFICADO SWAGGER DOCUMENTADO
/**
 * @swagger
 * /api/clientes/{id}:
 *   put:
 *     summary: Modificar un cliente existente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *           example:
 *             nombre: "Juan Perez"
 *             telefono: "1198765432"
 *     responses:
 *       200:
 *         description: Cliente actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *             example:
 *               id: 1
 *               nombre: "Juan Perez"
 *               telefono: "1198765432"
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             examples:
 *               error:
 *                 summary: Ejemplo de error de validación
 *                 value:
 *                   message: "Cliente con el nombre Patitas ya esta en uso"
 *               error2:
 *                 summary: Otro ejemplo de error de validación
 *                 value:
 *                   - atributo: "nombre"
 *                     mensaje: "\"nombre\" es obligatorio"
 *                   - atributo: "a"
 *                     mensaje: "\"a\" is not allowed"
 *       404:
 *         description: Cliente no encontrado
 *         content:
 *           application/json:
 *             example:
 *               message: "Cliente con id 1 no existe"
 */
router.put('/:id',
  validateClienteById,
  validateClienteUpdateSchema,
  validateClienteName,
  updateCliente
);

//3. Eliminar un cliente VERIFICADO SWAGGER DOCUMENTADO
/**
 * @swagger
 * /api/clientes/{id}:
 *   delete:
 *     summary: Eliminar un cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente eliminado exitosamente
 *         content:
 *           application/json:
 *             example:
 *               message: "Cliente eliminado correctamente"
 *       404:
 *         description: Cliente no encontrado
 *         content:
 *           application/json:
 *             example:
 *               message: "Cliente con id 1 no existe"
 */
router.delete('/:id', 
  validateClienteById,
  deleteCliente
);

//6. Obtener todos los clientes VERIFICADO SWAGGER DOCUMENTADO
/**
 * @swagger
 * /api/clientes:
 *   get:
 *     summary: Obtener todos los clientes
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Lista de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cliente'
 *             example:
 *               - id: 1
 *                 nombre: "Juan Perez"
 *                 telefono: "1123456789"
 *               - id: 2
 *                 nombre: "Maria Gomez"
 *                 telefono: "1134567890"
 */
router.get('/', getAllClientes);

//5. Obtener un cliente por su ID VERIFICADO SWAGGER DOCUMENTADO
/**
 * @swagger
 * /api/clientes/{id}:
 *   get:
 *     summary: Obtener un cliente por su ID
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *             example:
 *               id: 1
 *               nombre: "Juan Perez"
 *               telefono: "1123456789"
 *       404:
 *         description: Cliente no encontrado
 *         content:
 *           application/json:
 *             example:
 *               message: "Cliente con id 1 no existe"
 */
router.get('/:id', 
  validateClienteById,
  getClienteById
);

//6. Buscar clientes por nombre VERIFICADO SWAGGER DOCUMENTADO
/**
 * @swagger
 * /api/clientes/nombre/{nombre}:
 *   get:
 *     summary: Buscar clientes por nombre
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: nombre
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre del cliente
 *     responses:
 *       200:
 *         description: Clientes encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cliente'
 *             example:
 *               - id: 1
 *                 nombre: "Juan Perez"
 *                 telefono: "1123456789"
 *       404:
 *         description: Cliente no encontrado
 *         content:
 *           application/json:
 *             example:
 *               message: "Cliente con nombre Juan Perez no existe"
 */
router.get('/nombre/:nombre', 
  validateClienteByName,
  getClienteByName
);

module.exports = router;