const ensureDBExists = require("../db/ensureDBExists");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const db = require("../db/models");
const cors = require("cors");
const talleRoutes = require("./routes/talle.routes");
const colorRoutes = require("./routes/color.routes");
const preFacturaRoutes = require("./routes/preFactura.routes");
const clienteRoutes = require("./routes/cliente.routes");
const tipoDePrendaRoutes = require("./routes/tipoDePrenda.routes");
const productoRoutes = require("./routes/producto.routes");
const preFacturaProductoRoutes = require("./routes/preFacturaProducto.routes");
const stockProductoRoutes = require("./routes/stockProducto.routes");
const direccionRoutes = require("./routes/direccion.routes");
const backupRoutes = require("./routes/backup.routes");

const swaggerUI = require("swagger-ui-express");
const swaggerSpecs = require("./swagger/swagger");

app.use(express.json());
app.use(cors());

app.use("/api/talles", talleRoutes);
app.use("/api/colores", colorRoutes);
app.use("/api/preFacturas", preFacturaRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/tipoDePrendas", tipoDePrendaRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/preFacturaProductos", preFacturaProductoRoutes);
app.use("/api/stockProductos", stockProductoRoutes);
app.use("/api/direcciones", direccionRoutes);
app.use("/api/backups", backupRoutes);
app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpecs));


// Función para iniciar el servidor y sincronizar la base de datos
async function startServer() {
  try {
    await db.sequelize.sync(); // Sincroniza los modelos con la base de datos sin eliminar datos existentes
    app.listen(PORT,"0.0.0.0", () => {
      console.log(`Base de datos conectada y sincronizada correctamente en el puerto ${PORT}.`);
    });
  } catch (error) {
    console.error("Error al conectar la base de datos:", error);
  }
}

// Asegura la existencia de la base de datos y luego inicia el servidor
ensureDBExists().then(startServer).catch((err) => {
    console.error("Error creando la base de datos:", err);
  });
