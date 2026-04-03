const exec = require('child_process').exec;
const fs = require('fs');
const path = require('path');

const createBackup = async (req, res) => {
  console.log('=== INICIO BACKUP ===');
  
  // 1. Mostrar variables de entorno disponibles
  console.log('Variables de entorno:');
  console.log('  DB_HOST:', process.env.DB_HOST);
  console.log('  DB_PORT:', process.env.DB_PORT);
  console.log('  DB_USER:', process.env.DB_USER);
  console.log('  DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : 'undefined');
  console.log('  DB_NAME:', process.env.DB_NAME);

  const backupDir = req.backupDir;
  console.log('  backupDir:', backupDir);

  // 2. Verificar que el directorio existe y es escribible
  if (!fs.existsSync(backupDir)) {
    console.error('❌ Directorio de backups no existe:', backupDir);
    return res.status(500).json({ 
      mensaje: 'Error al crear el backup',
      error: 'Directorio de backups no existe'
    });
  }

  try {
    fs.accessSync(backupDir, fs.constants.W_OK);
    console.log('✓ Directorio de backups es escribible');
  } catch (err) {
    console.error('❌ Sin permisos de escritura:', err.message);
    return res.status(500).json({ 
      mensaje: 'Error al crear el backup',
      error: 'Sin permisos de escritura en directorio de backups'
    });
  }

  // 3. Construir variables con valores correctos para Docker
  const dbHost = process.env.DB_HOST || 'mysql';
  const dbPort = process.env.DB_PORT || '3306';  // IMPORTANTE: 3306 dentro de Docker
  const dbUser = process.env.DB_USER || 'root';
  const dbPassword = process.env.DB_PASSWORD || 'root123';
  const dbName = process.env.DB_NAME || 'control_stock_db';

  console.log('Valores finales:');
  console.log('  Host:', dbHost);
  console.log('  Puerto:', dbPort);
  console.log('  Usuario:', dbUser);
  console.log('  Base:', dbName);

  const timestamp = new Date().toISOString().split('T')[0];
  const backupFile = path.join(backupDir, `backup_${timestamp}.sql`);
  console.log('  Archivo:', backupFile);

  // 4. Verificar si mysqldump existe
  const checkMysqldump = () => {
    return new Promise((resolve, reject) => {
      exec('which mysqldump', (err, stdout, stderr) => {
        if (stdout.trim()) {
          console.log('✓ mysqldump encontrado en PATH:', stdout.trim());
          resolve('mysqldump');
        } else {
          reject(new Error('mysqldump no encontrado en PATH'));
        }
      });
    });
  };

  try {
    const mysqldumpBin = await checkMysqldump();
    console.log('✓ Usando mysqldump:', mysqldumpBin);
  } catch (err) {
    console.error('❌ mysqldump no disponible:', err.message);
    return res.status(500).json({ 
      mensaje: 'Error al crear el backup',
      error: 'mysqldump no está disponible en el contenedor',
      detail: err.message
    });
  }

  // 5. Verificar conexión a MySQL primero
  const testConnection = () => {
    return new Promise((resolve, reject) => {
     const testCmd = `mysqladmin ping -h ${dbHost} -P ${dbPort} -u ${dbUser} -p${dbPassword} --ssl-mode=DISABLED`;
      console.log('Probando conexión con:', testCmd.replace(dbPassword, '***'));
      
      exec(testCmd, (err, stdout, stderr) => {
        if (err) {
          console.error('❌ Error de conexión MySQL:', err.message);
          console.error('   stderr:', stderr);
          reject(err);
        } else {
          console.log('✓ Conexión a MySQL exitosa');
          resolve();
        }
      });
    });
  };

  try {
    await testConnection();
  } catch (connErr) {
    console.error('❌ Error de conexión:', connErr.message);
    return res.status(500).json({ 
      mensaje: 'Error al crear el backup',
      error: 'No se puede conectar a MySQL',
      detail: connErr.message,
      hint: 'Verificar DB_HOST, DB_PORT, DB_USER, DB_PASSWORD en variables de entorno'
    });
  }

  // 6. Ejecutar mysqldump (ssl-verify-server-cert=0 para self-signed certs)
  const mysqldumpCmd = `mysqldump -h ${dbHost} -P ${dbPort} -u ${dbUser} -p${dbPassword} ${dbName} --ssl-verify-server-cert=0 --result-file=${backupFile}`;
  console.log('Ejecutando:', mysqldumpCmd.replace(dbPassword, '***'));

  exec(mysqldumpCmd, (error, stdout, stderr) => {
    console.log('=== RESULTADO mysqldump ===');
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
    console.log('error:', error);

    if (error) {
      console.error('❌ Error ejecutando mysqldump:', error.message);
      console.error('   code:', error.code);
      console.error('   stderr:', stderr);
      return res.status(500).json({ 
        mensaje: 'Error al crear el backup',
        error: error.message,
        stderr: stderr,
        hint: 'Verificar que mysqldump pueda conectarse a la base de datos'
      });
    }

    // 7. Verificar que el archivo se creó
    if (!fs.existsSync(backupFile)) {
      console.error('❌ Archivo de backup no se creó');
      return res.status(500).json({ 
        mensaje: 'Error al crear el backup',
        error: 'El archivo no fue creado'
      });
    }

    const stats = fs.statSync(backupFile);
    console.log('✓ Backup creado exitosamente:', stats.size, 'bytes');

    res.status(201).json({
      mensaje: 'Backup creado exitosamente',
      archivo: `backup_${timestamp}.sql`,
      tamaño: `${(stats.size / 1024 / 1024).toFixed(2)} MB`,
      fecha: new Date()
    });
  });
};

const getBackups = (req, res) => {
  const backupDir = req.backupDir;
  
  if (!fs.existsSync(backupDir)) {
    return res.status(200).json({ backups: [] });
  }

  const files = fs.readdirSync(backupDir)
    .filter(file => file.endsWith('.sql'))
    .map(file => {
      const filePath = path.join(backupDir, file);
      const stats = fs.statSync(filePath);
      return {
        nombre: file,
        tamaño: `${(stats.size / 1024 / 1024).toFixed(2)} MB`,
        fechaCreacion: stats.birthtime
      };
    })
    .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));

  res.status(200).json({ backups: files });
};

const downloadBackup = (req, res) => {
  const backupFile = req.backupFile;
  const backupFileName = req.backupFileName;
  res.download(backupFile, backupFileName);
};

const restoreBackup = (req, res) => {
  console.log('=== INICIO RESTORE BACKUP ===');
  const backupDir = req.backupDir;
  const backupFileName = req.backupFileName;
  const backupFile = path.join(backupDir, backupFileName);

  console.log('backupDir:', backupDir);
  console.log('backupFileName:', backupFileName);
  console.log('backupFile:', backupFile);

  // 1. Verificar que el archivo existe
  if (!fs.existsSync(backupFile)) {
    console.error('❌ Archivo de backup no encontrado:', backupFile);
    return res.status(404).json({ 
      mensaje: 'Error al restaurar el backup',
      error: 'Archivo de backup no encontrado'
    });
  }

  // 2. Leer el archivo SQL
  let sqlContent;
  try {
    sqlContent = fs.readFileSync(backupFile, 'utf8');
    console.log('✓ Archivo leído, tamaño:', sqlContent.length, 'bytes');
  } catch (readErr) {
    console.error('❌ Error al leer archivo:', readErr.message);
    return res.status(500).json({ 
      mensaje: 'Error al restaurar el backup',
      error: 'No se pudo leer el archivo de backup',
      detail: readErr.message
    });
  }

  // 3. Filtrar líneas problemáticas (GTID)
  const originalLines = sqlContent.split('\n').length;
  sqlContent = sqlContent
    .split('\n')
    .filter(line => !line.includes('GTID_PURGED') && !line.includes('GTID_EXECUTED'))
    .join('\n');
  const filteredLines = sqlContent.split('\n').length;
  console.log('✓ Líneas procesadas:', originalLines, '->', filteredLines);

  // 4. Configurar conexión MySQL
  const dbHost = process.env.DB_HOST || 'mysql';
  const dbPort = process.env.DB_PORT || '3306';
  const dbUser = process.env.DB_USER || 'root';
  const dbPassword = process.env.DB_PASSWORD || 'root123';
  const dbName = process.env.DB_NAME || 'control_stock_db';

  console.log('Configuración MySQL:');
  console.log('  Host:', dbHost);
  console.log('  Port:', dbPort);
  console.log('  User:', dbUser);
  console.log('  DB:', dbName);

  // 5. Verificar que mysql está disponible
  const checkMysql = () => {
    return new Promise((resolve, reject) => {
      exec('which mysql', (err, stdout, stderr) => {
        if (stdout.trim()) {
          console.log('✓ mysql encontrado en PATH:', stdout.trim());
          resolve('mysql');
        } else {
          reject(new Error('mysql no encontrado en PATH'));
        }
      });
    });
  };

  checkMysql()
    .then(async () => {
      // 6. Probar conexión antes de restaurar (con retry para esperar que MySQL esté listo)
      const testConnectionWithRetry = async (maxRetries = 10, delayMs = 2000) => {
        let lastError = null;
        
        for (let i = 1; i <= maxRetries; i++) {
          console.log(`Intento ${i}/${maxRetries} de conexión a MySQL...`);
          
          try {
            await new Promise((resolve, reject) => {
              // MariaDB: --ssl-verify-server-cert=0 para ignorar self-signed certs
              const testCmd = `mysqladmin ping -h ${dbHost} -P ${dbPort} -u ${dbUser} -p${dbPassword} --ssl-verify-server-cert=0`;
              exec(testCmd, (err, stdout, stderr) => {
                if (err) {
                  reject(err);
                } else {
                  resolve();
                }
              });
            });
            console.log('✓ Conexión a MySQL exitosa');
            return true;
          } catch (err) {
            lastError = err;
            console.log(`  ❌ Intento ${i} falló: ${err.message}`);
            if (i < maxRetries) {
              await new Promise(r => setTimeout(r, delayMs));
            }
          }
        }
        
        throw lastError;
      };

      try {
        await testConnectionWithRetry();
      } catch (connErr) {
        console.error('❌ No se puede conectar a MySQL después de varios intentos:', connErr.message);
        return res.status(500).json({ 
          mensaje: 'Error al restaurar el backup',
          error: 'MySQL no disponible. Verificar que el contenedor de base de datos esté corriendo.',
          detail: connErr.message,
          hint: 'Verificar DB_HOST, DB_PORT, DB_USER, DB_PASSWORD en docker-compose'
        });
      }

      // 7. Ejecutar restauración (ssl-verify-server-cert=0 para self-signed certs)
      const mysqlCmd = `mysql -h ${dbHost} -P ${dbPort} -u ${dbUser} -p${dbPassword} --ssl-verify-server-cert=0 ${dbName}`;
      console.log('Ejecutando restore:', mysqlCmd.replace(dbPassword, '***'));
      
      const mysqlProc = exec(mysqlCmd, (error, stdout, stderr) => {
        console.log('=== RESULTADO RESTORE ===');
        console.log('stdout:', stdout);
        console.log('stderr:', stderr);
        console.log('error:', error);

        if (error) {
          console.error('❌ Error en restauración:', error.message);
          console.error('   code:', error.code);
          console.error('   stderr:', stderr);
          return res.status(500).json({ 
            mensaje: 'Error al restaurar el backup',
            error: error.message,
            stderr: stderr,
            hint: 'Verificar que el archivo SQL sea válido'
          });
        }

        console.log('✓ Backup restaurado exitosamente');
        res.status(200).json({
          mensaje: 'Backup restaurado exitosamente',
          archivo: backupFileName,
          fecha: new Date()
        });
      });

      mysqlProc.stdin.write(sqlContent);
      mysqlProc.stdin.end();
    })
    .catch((err) => {
      console.error('❌ mysql no disponible:', err.message);
      return res.status(500).json({ 
        mensaje: 'Error al restaurar el backup',
        error: 'mysql no está disponible en el contenedor',
        detail: err.message
      });
    });
};

module.exports = {
  createBackup,
  getBackups,
  downloadBackup,
  restoreBackup
};