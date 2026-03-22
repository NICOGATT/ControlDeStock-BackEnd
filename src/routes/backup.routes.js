const express = require('express');
const router = express.Router();
const { 
  createBackup, 
  getBackups, 
  downloadBackup, 
  restoreBackup 
} = require('../controllers/backup.controller');
const { 
  validateBackupDirExists, 
  validateBackupFileExists, 
  validateRestoreData 
} = require('../middlewares/backup.middleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Backup:
 *       type: object
 *       properties:
 *         nombre:
 *           type: string
 *           description: Nombre del archivo de backup
 *         tamaño:
 *           type: string
 *           description: Tamaño del archivo
 *         fechaCreacion:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del backup
 */

//1. Crear backup de la base de datos
/**
 * @swagger
 * /api/backups:
 *   post:
 *     summary: Crear backup de la base de datos
 *     tags: [Backups]
 *     responses:
 *       201:
 *         description: Backup creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                 archivo:
 *                   type: string
 *                 tamaño:
 *                   type: string
 *                 fecha:
 *                   type: string
 *                   format: date-time
 *             example:
 *               mensaje: "Backup creado exitosamente"
 *               archivo: "backup_2026-03-22.sql"
 *               tamaño: "2.45 MB"
 *               fecha: "2026-03-22T14:30:45.000Z"
 *       500:
 *         description: Error al crear el backup
 */
router.post('/',
  validateBackupDirExists,
  createBackup
);

//2. Obtener lista de backups disponibles
/**
 * @swagger
 * /api/backups:
 *   get:
 *     summary: Obtener lista de backups disponibles
 *     tags: [Backups]
 *     responses:
 *       200:
 *         description: Lista de backups
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 backups:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Backup'
 *             example:
 *               backups:
 *                 - nombre: "backup_2026-03-22.sql"
 *                   tamaño: "2.45 MB"
 *                   fechaCreacion: "2026-03-22T14:30:45.000Z"
 *       500:
 *         description: Error al obtener backups
 */
router.get('/',
  validateBackupDirExists,
  getBackups
);

//3. Restaurar un backup en la base de datos (DEBE IR ANTES DE /:archivo para evitar conflicto de rutas)
/**
 * @swagger
 * /api/backups/restore/data:
 *   post:
 *     summary: Restaurar un backup en la base de datos
 *     tags: [Backups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               archivo:
 *                 type: string
 *                 description: Nombre del archivo de backup a restaurar
 *             required:
 *               - archivo
 *           example:
 *             archivo: "backup_2026-03-22.sql"
 *     responses:
 *       200:
 *         description: Backup restaurado exitosamente
 *         content:
 *           application/json:
 *             example:
 *               mensaje: "Backup restaurado exitosamente"
 *               archivo: "backup_2026-03-22.sql"
 *               fecha: "2026-03-22T14:35:00.000Z"
 *       400:
 *         description: Archivo de backup no válido
 *       404:
 *         description: Archivo de backup no encontrado
 *       500:
 *         description: Error al restaurar el backup
 */
router.post('/restore/data',
  validateBackupDirExists,
  validateRestoreData,
  validateBackupFileExists,
  restoreBackup
);

//4. Descargar un backup específico
/**
 * @swagger
 * /api/backups/{archivo}:
 *   get:
 *     summary: Descargar un backup específico
 *     tags: [Backups]
 *     parameters:
 *       - in: path
 *         name: archivo
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre del archivo de backup
 *     responses:
 *       200:
 *         description: Descarga del archivo en progreso
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Ruta de archivo inválida
 *       404:
 *         description: Archivo no encontrado
 */
router.get('/:archivo',
  validateBackupDirExists,
  validateBackupFileExists,
  downloadBackup
);

module.exports = router;
