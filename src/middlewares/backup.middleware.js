// Importar módulos necesarios
const fs = require('fs'); // Para operaciones de archivos
const path = require('path'); // Para manipular rutas de archivos

const validateBackupDirExists = (req, res, next) => {
  try {
    // Construir la ruta absoluta del directorio de backups
    const backupDir = path.join(__dirname, '../../backups');
    
    // Verificar si el directorio existe
    if (!fs.existsSync(backupDir)) {
      // Si no existe, crearlo de forma recursiva (crea todos los directorios necesarios)
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    // Guardar la ruta del directorio en la request para usarla en altri middleware/controller
    req.backupDir = backupDir;
    // Pasar al siguiente middleware
    next();
  } catch (error) {
    // Si ocurre un error, devolver respuesta de error con código 500
    res.status(500).json({
      message: 'Error al validar directorio de backups'
    });
  }
};

const validateBackupFileExists = (req, res, next) => {
  try {
    // Extraer el nombre del archivo: primero del body (POST), luego de params (GET)
    const archivo = req.body?.archivo || req.params?.archivo;

    // Verificar que el archivo fue proporcionado
    if (!archivo) {
      // Retornar error si no existe
      return res.status(400).json({
        message: 'Debe proporcionar el nombre del archivo de backup'
      });
    }

    // Obtener el directorio de backups (previamente almacenado o créarlo)
    const backupDir = req.backupDir || path.join(__dirname, '../../backups');
    // Construir la ruta completa del archivo
    const backupFile = path.join(backupDir, archivo);

    // *** VALIDACIÓN DE SEGURIDAD: Prevenir Path Traversal (ej: ../../../etc/passwd) ***
    // Verificar que la ruta del archivo comienza con el directorio de backups
    if (!backupFile.startsWith(backupDir)) {
      // Si no es así, alguien está intentando acceder a directorios no autorizados
      return res.status(400).json({
        message: 'Ruta de archivo inválida'
      });
    }

    // Verificar que el archivo existe en el sistema de archivos
    if (!fs.existsSync(backupFile)) {
      return res.status(404).json({
        message: 'Archivo de backup no encontrado'
      });
    }

    // Validar que es un archivo con extensión .sql para evitar descargar otros tipos de archivos
    if (!archivo.endsWith('.sql')) {
      return res.status(400).json({
        message: 'El archivo debe ser un archivo SQL (.sql)'
      });
    }

    // Almacenar en la request la ruta completa y el nombre del archivo para usarlo después
    req.backupFile = backupFile;
    req.backupFileName = archivo;
    // Pasar al siguiente middleware
    next();
  } catch (error) {
    // Si ocurre un error inesperado, devolver error 500
    res.status(500).json({
      message: 'Error al validar archivo de backup'
    });
  }
};

const validateRestoreData = (req, res, next) => {
  try {
    // Extraer el nombre del archivo del body de la request
    const { archivo } = req.body;

    // Validar que:
    // - archivo existe (no es undefined/null)
    // - archivo es un string
    // - archivo no está vacío (después de quitar espacios)
    if (!archivo || typeof archivo !== 'string' || archivo.trim() === '') {
      return res.status(400).json({
        message: 'El campo archivo es obligatorio y debe ser un texto válido'
      });
    }

    // Si pasa la validación, guardar el nombre del archivo en la request
    req.backupFileName = archivo;
    // Pasar al siguiente middleware
    next();
  } catch (error) {
    // Si ocurre un error inesperado, devolver error 500
    res.status(500).json({
      message: 'Error al validar datos de restauración'
    });
  }
};

module.exports = {
  validateBackupDirExists,
  validateBackupFileExists,
  validateRestoreData
};