const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const db = require('../db/models');
const cors = require('cors');
const talleRoutes = require('./routes/talle.routes');
const colorRoutes = require('./routes/color.routes');
const preFacturaRoutes = require("./routes/preFactura.routes");
const clienteRoutes = require("./routes/cliente.routes");

const swaggerUI = require('swagger-ui-express');
const swaggerSpecs = require('./swagger/swagger');

app.use(express.json());
app.use(cors());

app.use('/api/talles', talleRoutes);
app.use('/api/colores', colorRoutes);
app.use('/api/preFactura', preFacturaRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpecs));

/*
  Correr por primera vez para crear la base y tablas
  1) npx sequelize-cli db:create // Crear la base de datos
  2) npx sequelize-cli db:migrate // Crear las tablas según las migraciones
*/

app.listen(PORT, async () => {
  try {
    await db.sequelize.sync(); // Sincroniza los modelos con la base de datos sin eliminar datos existentes
    console.log(`Base de datos conectada y sincronizada correctamente en el puerto ${PORT}.`);
  }
  catch (error) {
    console.error('Error al conectar la base de datos:', error);
  }
});