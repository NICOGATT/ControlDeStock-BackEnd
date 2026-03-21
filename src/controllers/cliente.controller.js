const { Cliente, Direccion } = require('../../db/models');
const genericController = require('./generic.controller');
//1. Crear un nuevo cliente
const createCliente = async (req, res) => {
  const { nombre, telefono, cuit, email, nombreEmpresa, condicionTributaria, 
    direccion, codigoPostal, ciudad, provincia } = req.body;
  const newCliente = await Cliente.create({ 
    nombre, 
    telefono, 
    cuit, 
    email, 
    nombreEmpresa, 
    condicionTributaria 
  });
  const newDireccion = await Direccion.create({ 
    direccion, 
    clienteId: newCliente.id, 
    codigoPostal, 
    ciudad, 
    provincia 
  });
  return res.status(201).json({
    ...newCliente.toJSON(),
    direccion: await newDireccion.toJSON()
  });
}

//2. Modificar un cliente existente
const updateCliente = async (req, res) => {
  const { id } = req.params;
  await Cliente.update(req.body, { where: { id } });
  return res.status(200).json(await Cliente.findByPk(id));
}

//3. Eliminar un cliente
const deleteCliente = genericController.deleteModel(Cliente);

//4. Obtener un cliente por su ID
const getClienteById = genericController.getModelById(Cliente);

//5. Obtener todos los clientes
const getAllClientes = genericController.getAllModels(Cliente);

//6. Buscar clientes por nombre
const getClienteByName = genericController.getModelByParam(Cliente, "nombre");

module.exports = {
  createCliente,
  updateCliente,
  deleteCliente,
  getClienteById,
  getAllClientes,
  getClienteByName
};