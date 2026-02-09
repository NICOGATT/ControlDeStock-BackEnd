const { PreFactura, Cliente } = require("../../db/models");
const genericController = require("./generic.controller");
const { Op } = require("sequelize");

//1. Crear una nueva preFactura
const createPreFactura = async (req, res) => {
  const { clienteId } = req.body;
  const newPreFactura = await PreFactura.create({
    fecha: new Date(),
  });

  //Revisar esto, seguro conviene mas usar el nombre del cliente en vez del id
  await Cliente.findOrCreate({
    where: { id: clienteId },
    defaults: { id: clienteId },
  }).then(([cliente, created]) => {
    newPreFactura.setCliente(cliente);
  });

  res.status(201).json(await newPreFactura.reload());
};

//2. Eliminar una preFactura por ID
const deletePreFacturaById = genericController.deleteModel(PreFactura);

//3. Obtener todas las preFacturas
const getAllPreFacturas = genericController.getAllModels(PreFactura);

//4. Obtener una preFactura por ID
const getPreFacturaById = genericController.getModelById(PreFactura);

//5. Obtener todas las preFacturas de un cliente
const getPreFacturasByClient = genericController.getModelByParam(
  PreFactura,
  "cliente",
);

//6. Obtener todas las preFacturas en una fecha específica
const getPreFacturasByDate = async (req, res) => {
  const { fecha } = req.params;
  //agrego esto porque tiene el tiempo ademas de la fecha, si pongo solo fecha para comparar no lo toma
  const desde = new Date(fecha + "T00:00:00.000Z");
  const hasta = new Date(fecha + "T23:59:59.999Z");

  const preFacturas = await PreFactura.findAll({
    where: {
      fecha: {
        [Op.between]: [desde, hasta],
      },
    },
  });
  res.status(200).json(preFacturas);
};

module.exports = {
  createPreFactura,
  deletePreFacturaById,
  getAllPreFacturas,
  getPreFacturaById,
  getPreFacturasByClient,
  getPreFacturasByDate,
};
