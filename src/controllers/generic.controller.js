//1. Crear un nuevo registro
const createModel = (Model) => async (req, res) => {
  const newEntity = await Model.create(req.body);
  return res.status(201).json(newEntity);
};

//2. Actualizar un registro existente
const updateModel = (Model) => async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  await Model.update({ nombre }, { where: { id } });
  return res.status(200).json(await Model.findByPk(id));
};

//3. Eliminar un registro
const deleteModel = (Model) => async (req, res) => {
  const { id } = req.params;
  await Model.destroy({ where: { id } });
  return res.status(204).send();
};

//4. Obtener todos los registros
const getAllModels = (Model) => async (req, res) => {
  try {
    const entities = await Model.findAll();
    return res.status(200).json(entities);
  } catch (error) {
    console.error('Error en getAllModels:', error);
    return res.status(500).json({ error: error.message });
  }
};

//5. Obtener un registro por ID
const getModelById = (Model) => async (req, res) => {
  const { id } = req.params;
  const entity = await Model.findByPk(id);
  return res.status(200).json(entity);
};

//6. Obtener registros por atributo de ruta
const getModelByParam = (Model, attribute) => async (req, res) => {
  const value = req.params[attribute];
  const entities = await Model.findAll({ where: { [attribute]: value } });
  return res.status(200).json(entities);
}

module.exports = {
  createModel,
  updateModel,
  deleteModel,
  getAllModels,
  getModelById,
  getModelByParam
};