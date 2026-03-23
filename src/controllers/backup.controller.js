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
      const testCmd = `mysqladmin ping -h ${dbHost} -P ${dbPort} -u ${dbUser} -p${dbPassword} --ssl-verify-server-cert=0 --default-auth=mysql_native_password`;
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

  // 6. Ejecutar mysqldump con autenticación nativa para MySQL 8
  const mysqldumpCmd = `mysqldump -h ${dbHost} -P ${dbPort} -u ${dbUser} -p${dbPassword} --ssl-verify-server-cert=0 --default-auth=mysql_native_password ${dbName} --result-file=${backupFile}`;
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
  const backupDir = req.backupDir;
  const backupFileName = req.backupFileName;
  const backupFile = path.join(backupDir, backupFileName);

  let sqlContent = fs.readFileSync(backupFile, 'utf8');

  sqlContent = sqlContent
    .split('\n')
    .filter(line => !line.includes('GTID_PURGED') && !line.includes('GTID_EXECUTED'))
    .join('\n');

  const dbHost = process.env.DB_HOST || 'mysql';
  const dbPort = process.env.DB_PORT || '3306';
  const dbUser = process.env.DB_USER || 'root';
  const dbPassword = process.env.DB_PASSWORD || 'root123';
  const dbName = process.env.DB_NAME || 'control_stock_db';

  const mysqlCmd = `mysql -h ${dbHost} -P ${dbPort} -u ${dbUser} -p${dbPassword} ${dbName}`;
  
  const mysqlProc = exec(mysqlCmd, (error, stdout, stderr) => {
    if (error) {
      console.error('Error en restauración:', error);
      return res.status(500).json({ 
        mensaje: 'Error al restaurar el backup',
        error: error.message 
      });
    }

    res.status(200).json({
      mensaje: 'Backup restaurado exitosamente',
      archivo: backupFileName,
      fecha: new Date()
    });
  });

  mysqlProc.stdin.write(sqlContent);
  mysqlProc.stdin.end();
};

module.exports = {
  createBackup,
  getBackups,
  downloadBackup,
  restoreBackup
};