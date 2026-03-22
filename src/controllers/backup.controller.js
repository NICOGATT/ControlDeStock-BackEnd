// Importar módulos necesarios
const exec = require('child_process').execFile; // Para ejecutar comandos del sistema (mysqldump, mysql)
const fs = require('fs'); // Para operaciones de archivos
const path = require('path'); // Para manipular rutas de archivos

// Función para obtener la ruta a mysqldump según el SO
const getMysqldumpPath = () => {
  // Si está definida en variables de entorno, usarla
  if (process.env.MYSQL_BIN_PATH) {
    const path1 = path.join(process.env.MYSQL_BIN_PATH, 'mysqldump.exe');
    if (fs.existsSync(path1)) {
      console.log('✓ mysqldump encontrado en:', path1);
      return path1;
    }
  }
  
  // En Windows, intentar rutas comunes de MySQL
  if (process.platform === 'win32') {
    const commonPaths = [
      'C:\\Program Files\\MySQL\\MySQL Server 9.6\\bin\\mysqldump.exe',
      'C:\\Program Files\\MySQL\\MySQL Server 9.0\\bin\\mysqldump.exe',
      'C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysqldump.exe',
      'C:\\Program Files\\MySQL\\MySQL Server 5.7\\bin\\mysqldump.exe',
      'C:\\Program Files (x86)\\MySQL\\MySQL Server 8.0\\bin\\mysqldump.exe',
      'C:\\Program Files (x86)\\MySQL\\MySQL Server 5.7\\bin\\mysqldump.exe'
    ];
    
    for (const p of commonPaths) {
      if (fs.existsSync(p)) {
        console.log('✓ mysqldump encontrado en:', p);
        return p;
      }
    }
    
    console.warn('⚠ mysqldump no encontrado en rutas conocidas de MySQL');
  }
  
  // En Unix/Linux/Mac, normalmente está en el PATH
  console.log('ℹ Intentando usar mysqldump desde PATH');
  return 'mysqldump';
};

// Función para obtener la ruta a mysql según el SO
const getMysqlPath = () => {
  // Si está definida en variables de entorno, usarla
  if (process.env.MYSQL_BIN_PATH) {
    const path1 = path.join(process.env.MYSQL_BIN_PATH, 'mysql.exe');
    if (fs.existsSync(path1)) {
      console.log('✓ mysql encontrado en:', path1);
      return path1;
    }
  }
  
  // En Windows, intentar rutas comunes de MySQL
  if (process.platform === 'win32') {
    const commonPaths = [
      'C:\\Program Files\\MySQL\\MySQL Server 9.6\\bin\\mysql.exe',
      'C:\\Program Files\\MySQL\\MySQL Server 9.0\\bin\\mysql.exe',
      'C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysql.exe',
      'C:\\Program Files\\MySQL\\MySQL Server 5.7\\bin\\mysql.exe',
      'C:\\Program Files (x86)\\MySQL\\MySQL Server 8.0\\bin\\mysql.exe',
      'C:\\Program Files (x86)\\MySQL\\MySQL Server 5.7\\bin\\mysql.exe'
    ];
    
    for (const p of commonPaths) {
      if (fs.existsSync(p)) {
        console.log('✓ mysql encontrado en:', p);
        return p;
      }
    }
    
    console.warn('⚠ mysql no encontrado en rutas conocidas de MySQL');
  }
  
  // En Unix/Linux/Mac, normalmente está en el PATH
  console.log('ℹ Intentando usar mysql desde PATH');
  return 'mysql';
};

const createBackup = async (req, res) => {
  // Obtener el directorio de backups que fue validado en el middleware
  const backupDir = req.backupDir;
  
  // Generar un timestamp con el formato YYYY-MM-DD para el nombre del archivo
  // Usar solo la fecha sin hora para que sea más legible
  const timestamp = new Date().toISOString().split('T')[0];
  // Construir la ruta completa del archivo de backup
  const backupFile = path.join(backupDir, `backup_${timestamp}.sql`);

  // Ejecutar el comando mysqldump (usar execFile es más seguro que exec)
  // execFile no permite inyección de comandos como ejecutaría exec
  const mysqldump = exec(getMysqldumpPath(), [
    // Host del servidor MySQL
    `-h${process.env.DB_HOST || '127.0.0.1'}`,
    // Puerto del servidor MySQL
    `-P${process.env.DB_PORT || '3307'}`,
    // Usuario de la base de datos (por defecto 'root')
    `-u${process.env.DB_USER || 'root'}`,
    // Contraseña de la base de datos
    `-p${process.env.DB_PASSWORD || 'root'}`,
    // No incluir información de GTID_PURGED (evita conflictos al restaurar)
    '--set-gtid-purged=OFF',
    // Nombre de la base de datos a respaldar
    process.env.DB_NAME || 'control_stock_db',
    // Guardar el dump en un archivo en lugar de stdout
    '--result-file=' + backupFile
  ], (error, stdout, stderr) => {
    // Callback que se ejecuta cuando mysqldump termina

    // Si hay error, registrarlo en la consola
    if (error) {
      console.error('Error en backup:', error);
      // Retornar respuesta de error al cliente
      return res.status(500).json({ 
        mensaje: 'Error al crear el backup',
        error: error.message 
      });
    }

    // Si el backup fue exitoso, obtener información del archivo
    const stats = fs.statSync(backupFile);
    // Responder con éxito y convertir bytes a MB
    res.status(201).json({
      mensaje: 'Backup creado exitosamente',
      archivo: `backup_${timestamp}.sql`,
      // Convertir bytes a MB y redondear a 2 decimales
      tamaño: `${(stats.size / 1024 / 1024).toFixed(2)} MB`,
      fecha: new Date()
    });
  });
};

const getBackups = (req, res) => {
  // Obtener el directorio de backups validado (siempre existe gracias al middleware)
  const backupDir = req.backupDir;
  
  // Verificar si el directorio existe (seguridad extra)
  if (!fs.existsSync(backupDir)) {
    return res.status(200).json({ backups: [] });
  }

  // Leer todos los archivos del directorio
  const files = fs.readdirSync(backupDir)
    // Filtrar solo archivos .sql
    .filter(file => file.endsWith('.sql'))
    // Mapear cada archivo a un objeto con información útil
    .map(file => {
      // Construir ruta completa del archivo
      const filePath = path.join(backupDir, file);
      // Obtener información del archivo (tamaño, fecha creación, etc)
      const stats = fs.statSync(filePath);
      return {
        nombre: file,
        // Convertir tamaño de bytes a MB con 2 decimales
        tamaño: `${(stats.size / 1024 / 1024).toFixed(2)} MB`,
        // Fecha de creación del archivo
        fechaCreacion: stats.birthtime
      };
    })
    // Ordenar por fecha de creación (más recientes primero) - descendente
    .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));

  // Devolver la lista de backups
  res.status(200).json({ backups: files });
};

const downloadBackup = (req, res) => {
  // Obtener la ruta completa del archivo (validada en middleware)
  const backupFile = req.backupFile;
  // Obtener el nombre del archivo (validado en middleware)
  const backupFileName = req.backupFileName;

  // Usar res.download para enviar el archivo al cliente
  // Los parámetros son: ruta del archivo y nombre que tendrá la descarga
  res.download(backupFile, backupFileName);
};

const restoreBackup = (req, res) => {
  // Obtener el directorio de backups
  const backupDir = req.backupDir;
  // Obtener el nombre del archivo del body (ya validado en middleware)
  const backupFileName = req.backupFileName;
  // Construir la ruta completa del archivo
  const backupFile = path.join(backupDir, backupFileName);

  // Leer el contenido completo del archivo SQL
  // Usar 'utf8' para que se devuelva como string en lugar de Buffer
  let sqlContent = fs.readFileSync(backupFile, 'utf8');

  // Filtrar lineas de GTID que pueden causar conflictos
  // Quitar cualquier línea que contenga SET @@GLOBAL.GTID_PURGED o SET @@SESSION.GTID_EXECUTED
  sqlContent = sqlContent
    .split('\n')
    .filter(line => !line.includes('GTID_PURGED') && !line.includes('GTID_EXECUTED'))
    .join('\n');

  // Ejecutar el cliente mysql para restaurar la base de datos
  const mysql = exec(getMysqlPath(), [
    // Host del servidor MySQL
    `-h${process.env.DB_HOST || '127.0.0.1'}`,
    // Puerto del servidor MySQL
    `-P${process.env.DB_PORT || '3307'}`,
    // Usuario de la base de datos
    `-u${process.env.DB_USER || 'root'}`,
    // Contraseña
    `-p${process.env.DB_PASSWORD || 'root'}`,
    // Base de datos a restaurar
    process.env.DB_NAME || 'control_stock_db'
  ], (error, stdout, stderr) => {
    // Callback que se ejecuta cuando el comando mysql termina
    
    // Si hay error en la ejecución
    if (error) {
      // Registrar el error en la consola del servidor
      console.error('Error en restauración:', error);
      // Devolver respuesta de error al cliente
      return res.status(500).json({ 
        mensaje: 'Error al restaurar el backup',
        error: error.message 
      });
    }

    // Si la restauración fue exitosa, devolver confirmación
    res.status(200).json({
      mensaje: 'Backup restaurado exitosamente',
      archivo: backupFileName,
      fecha: new Date()
    });
  });

  // Escribir el contenido SQL en el stdin del proceso mysql
  // Esto envía el SQL al comando mysql para que lo procese
  mysql.stdin.write(sqlContent);
  // Cerrar el stdin para indicar que no hay más datos a procesar
  mysql.stdin.end();
};

// Exportar todos los controladores para usarlos en las rutas
module.exports = {
  createBackup,
  getBackups,
  downloadBackup,
  restoreBackup
};
