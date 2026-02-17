const { PreFactura, Cliente } = require("../../db/models");
const genericController = require("./generic.controller");
const { Op } = require("sequelize");

//1. Crear una nueva preFactura
const createPreFactura = async (req, res) => {
  const { cliente, telefono } = req.body;
  const newPreFactura = await PreFactura.create({
    fecha: new Date(),
  });

  await Cliente.findOrCreate({
    where: { nombre: cliente, telefono },
  }).then(([cliente, created]) => {
    newPreFactura.setCliente(cliente);
    newPreFactura.reload();
  });

  res.status(201).json(newPreFactura);
};

//2. Eliminar una preFactura por ID
const deletePreFacturaById = genericController.deleteModel(PreFactura);

//3. Obtener todas las preFacturas
const getAllPreFacturas = async (req, res) => {
  const preFacturas = await PreFactura.findAll({
    attributes: ["id", "fecha"],
    include: {
      model: Cliente,
      as: "cliente",
      attributes: ["nombre", "telefono"],
    },
  });
  res.status(200).json(preFacturas);
};

//4. Obtener una preFactura por ID
const getPreFacturaById = async (req, res) => {
  const { id } = req.params;
  const preFactura = await PreFactura.findByPk(id, {
    attributes: ["id", "fecha"],
    include: {
      model: Cliente,
      as: "cliente",
      attributes: ["nombre", "telefono"],
    },
  });
  res.status(200).json(preFactura);
}

//5. Obtener todas las preFacturas de un cliente
const getPreFacturasByClient = async (req, res) => {
  const { nombre } = req.params;
  const cliente = await Cliente.findOne({ where: { nombre } });

  const preFacturas = await PreFactura.findAll({
    attributes: ["id", "fecha"],
    where: { clienteId: cliente.id },
    include: {
      model: Cliente,
      as: "cliente",
      attributes: ["nombre", "telefono"],
    },
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
    attributes: ["id", "fecha"],
    where: {
      fecha: {
        [Op.between]: [desde, hasta],
      },
    },
    include: {
      model: Cliente,
      as: "cliente",
      attributes: ["nombre", "telefono"],
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
