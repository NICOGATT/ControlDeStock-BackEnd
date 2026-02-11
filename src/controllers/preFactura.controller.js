const { PreFactura, Cliente } = require("../../db/models");
const genericController = require("./generic.controller");
const { Op } = require("sequelize");

//1. Crear una nueva preFactura
const createPreFactura = async (req, res) => {
  const { cliente } = req.body;
  const newPreFactura = await PreFactura.create({
    fecha: new Date(),
  });

  await Cliente.findOrCreate({
    where: { nombre: cliente },
  }).then(([cliente, created]) => {
    newPreFactura.setCliente(cliente);
    newPreFactura.reload();
  });

  res.status(201).json(newPreFactura);
};

//2. Eliminar una preFactura por ID
const deletePreFacturaById = genericController.deleteModel(PreFactura);

//3. Obtener todas las preFacturas
const getAllPreFacturas = genericController.getAllModels(PreFactura);

//4. Obtener una preFactura por ID
const getPreFacturaById = genericController.getModelById(PreFactura);

//5. Obtener todas las preFacturas de un cliente
const getPreFacturasByClient = async (req, res) => {
  const { nombre } = req.params;
  const cliente = await Cliente.findOne({ where: { nombre } });

  const preFacturas = await PreFactura.findAll({
    where: { clienteId: cliente.id },
  });

  res.status(200).json(preFacturas);
};

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
