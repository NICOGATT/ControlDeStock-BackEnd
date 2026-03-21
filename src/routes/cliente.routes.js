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
 *     ClienteEntrada:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           description: Nombre del cliente (único)
 *           example: "Juan Perez"
 *         telefono:
 *           type: string
 *           description: Teléfono del cliente (10 dígitos)
 *           example: "1123456789"
 *         cuit:
 *           type: string
 *           description: CUIT del cliente (formato XX-XXXXXXXX-X)
 *           example: "20-12345678-9"
 *         email:
 *           type: string
 *           format: email
 *           description: Email del cliente
 *           example: "juan.perez@example.com"
 *         nombreEmpresa:
 *           type: string
 *           description: Nombre de la empresa
 *           example: "Empresa Juan SRL"
 *         condicionTributaria:
 *           type: string
 *           description: Condición tributaria del cliente
 *           example: "Responsable Inscripto"
 *         direccion:
 *           type: string
 *           description: Dirección del cliente
 *           example: "Av. Libertad 123"
 *         codigoPostal:
 *           type: string
 *           description: Código postal (4-5 dígitos)
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
 *         - nombre
 *         - telefono
 *         - cuit
 *         - email
 *         - nombreEmpresa
 *         - condicionTributaria
 *         - direccion
 *         - codigoPostal
 *         - ciudad
 *         - provincia
 *     ClienteCreado:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del cliente
 *           example: 1
 *         nombre:
 *           type: string
 *           description: Nombre del cliente (único)
 *           example: "Juan Perez"
 *         telefono:
 *           type: string
 *           description: Teléfono del cliente (10 dígitos)
 *           example: "1123456789"
 *         cuit:
 *           type: string
 *           description: CUIT del cliente (formato XX-XXXXXXXX-X)
 *           example: "20-12345678-9"
 *         email:
 *           type: string
 *           format: email
 *           description: Email del cliente
 *           example: "juan.perez@example.com"
 *         nombreEmpresa:
 *           type: string
 *           description: Nombre de la empresa
 *           example: "Empresa Juan SRL"
 *         condicionTributaria:
 *           type: string
 *           description: Condición tributaria del cliente
 *           example: "Responsable Inscripto"
 *         direccion:
 *           type: object
 *           description: Objeto dirección asociada al cliente
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             direccion:
 *               type: string
 *               example: "Av. Libertad 123"
 *             clienteId:
 *               type: integer
 *               example: 1
 *             codigoPostal:
 *               type: string
 *               example: "1425"
 *             ciudad:
 *               type: string
 *               example: "Buenos Aires"
 *             provincia:
 *               type: string
 *               example: "CABA"
 *     Cliente:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del cliente
 *           example: 1
 *         nombre:
 *           type: string
 *           description: Nombre del cliente (único)
 *           example: "Juan Perez"
 *         telefono:
 *           type: string
 *           description: Teléfono del cliente (10 dígitos)
 *           example: "1123456789"
 *         cuit:
 *           type: string
 *           description: CUIT del cliente (formato XX-XXXXXXXX-X)
 *           example: "20-12345678-9"
 *         email:
 *           type: string
 *           format: email
 *           description: Email del cliente
 *           example: "juan.perez@example.com"
 *         nombreEmpresa:
 *           type: string
 *           description: Nombre de la empresa
 *           example: "Empresa Juan SRL"
 *         condicionTributaria:
 *           type: string
 *           description: Condición tributaria del cliente
 *           example: "Responsable Inscripto"
 *       required:
 *         - nombre
 *         - telefono
 *         - cuit
 *         - email
 *         - nombreEmpresa
 *         - condicionTributaria
 *     ClienteActualizar:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           description: Nombre del cliente (único, opcional en actualización)
 *           example: "Juan Perez Actualizado"
 *         telefono:
 *           type: string
 *           description: Teléfono del cliente (10 dígitos, opcional en actualización)
 *           example: "1198765432"
 *         cuit:
 *           type: string
 *           description: CUIT del cliente (formato XX-XXXXXXXX-X, opcional en actualización)
 *           example: "20-12345678-9"
 *         email:
 *           type: string
 *           format: email
 *           description: Email del cliente (opcional en actualización)
 *           example: "juan.perez.actualizado@example.com"
 *         nombreEmpresa:
 *           type: string
 *           description: Nombre de la empresa (opcional en actualización)
 *           example: "Empresa Juan SRL Modificada"
 *         condicionTributaria:
 *           type: string
 *           description: Condición tributaria del cliente (opcional en actualización)
 *           example: "Monotributista"
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
 *             $ref: '#/components/schemas/ClienteEntrada'
 *           example:
 *             nombre: "Juan Perez"
 *             telefono: "1123456789"
 *             cuit: "20-12345678-9"
 *             email: "juan.perez@example.com"
 *             nombreEmpresa: "Empresa Juan SRL"
 *             condicionTributaria: "Responsable Inscripto"
 *             direccion: "Av. Libertad 123"
 *             codigoPostal: "1425"
 *             ciudad: "Buenos Aires"
 *             provincia: "CABA"
 *     responses:
 *       201:
 *         description: Cliente creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClienteCreado'
 *             example:
 *               id: 1
 *               nombre: "Juan Perez"
 *               telefono: "1123456789"
 *               cuit: "20-12345678-9"
 *               email: "juan.perez@example.com"
 *               nombreEmpresa: "Empresa Juan SRL"
 *               condicionTributaria: "Responsable Inscripto"
 *               direccion:
 *                 id: 1
 *                 direccion: "Av. Libertad 123"
 *                 clienteId: 1
 *                 codigoPostal: "1425"
 *                 ciudad: "Buenos Aires"
 *                 provincia: "CABA"
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
 *             $ref: '#/components/schemas/ClienteActualizar'
 *           example:
 *             nombre: "Juan Perez"
 *             telefono: "1198765432"
 *             cuit: "20-12345678-9"
 *             email: "juan.perez@example.com"
 *             nombreEmpresa: "Empresa Juan SRL Modificada"
 *             condicionTributaria: "Monotributista"
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
 *               cuit: "20-12345678-9"
 *               email: "juan.perez@example.com"
 *               nombreEmpresa: "Empresa Juan SRL Modificada"
 *               condicionTributaria: "Monotributista"
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
 *                 cuit: "20-12345678-9"
 *                 email: "juan.perez@example.com"
 *                 nombreEmpresa: "Empresa Juan SRL"
 *                 condicionTributaria: "Responsable Inscripto"
 *               - id: 2
 *                 nombre: "Maria Gomez"
 *                 telefono: "1134567890"
 *                 cuit: "27-98765432-1"
 *                 email: "maria.gomez@example.com"
 *                 nombreEmpresa: "Empresa Maria SRL"
 *                 condicionTributaria: "Monotributista"
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
 *               cuit: "20-12345678-9"
 *               email: "juan.perez@example.com"
 *               nombreEmpresa: "Empresa Juan SRL"
 *               condicionTributaria: "Responsable Inscripto"
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
 *                 cuit: "20-12345678-9"
 *                 email: "juan.perez@example.com"
 *                 nombreEmpresa: "Empresa Juan SRL"
 *                 condicionTributaria: "Responsable Inscripto"
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