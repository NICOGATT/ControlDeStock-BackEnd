const { Cliente } = require('../../db/models');
const genericController = require('./generic.controller');
//1. Crear un nuevo cliente
const createCliente = genericController.createModel(Cliente);

//2. Modificar un cliente existente
const updateCliente = genericController.updateModel(Cliente);

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