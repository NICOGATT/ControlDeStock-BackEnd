const { Direccion } = require("../../db/models");
const genericController = require("./generic.controller");

//1. Crear una nueva dirección para un cliente
const createDireccion = genericController.createModel(Direccion);

//2. Editar una direccion de un cliente
const updateDireccion = async (req, res) => {
  const { direccion, clienteId, direccionNueva, codigoPostal, ciudad, provincia } = req.body;

  const updateData = {};
  if (direccionNueva) updateData.direccion = direccionNueva;
  if (codigoPostal) updateData.codigoPostal = codigoPostal;
  if (ciudad) updateData.ciudad = ciudad;
  if (provincia) updateData.provincia = provincia;

  await Direccion.update(
    updateData,
    { where: { direccion, clienteId } }
  );

  // Buscar por la dirección nueva si se actualizó, si no por la original
  const direccionBusqueda = direccionNueva || direccion;
  const updatedDireccion = await Direccion.findOne({ where: { direccion: direccionBusqueda, clienteId } });

  res.status(200).json(updatedDireccion);
}

//3. Eliminar una direccion de un cliente
const deleteDireccion = async (req, res) => {
  const { direccion, clienteId } = req.body;
  await Direccion.destroy({ where: { direccion, clienteId } });
  res.status(204).send();
}

//4. Obtener todas las direcciones de un cliente
const getDireccionesByCliente = async (req, res) => {
  const { clienteId } = req.params;
  const direcciones = await Direccion.findAll({ where: { clienteId } });
  res.status(200).json(direcciones);
}

//5. Obtener todas las direcciones de todos los clientes
const getAllDirecciones = genericController.getAllModels(Direccion);

module.exports = {
  createDireccion,
  updateDireccion,
  deleteDireccion,
  getDireccionesByCliente,
  getAllDirecciones
};