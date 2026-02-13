const { Producto, Color, Talle, TipoDePrenda } = require("../../db/models");
const genericControllers = require("./generic.controller");

//1. Crear un nuevo producto
const asociarModelo = async (modelo, valor) => {
  const [registro] = await modelo.findOrCreate({ where: { nombre: valor } });
  return registro;
};

//EDITAR CUANDO TERMINE STOCKPRODUCTO
const createProducto = async (req, res) => {
  const { nombre, cantidad, precio, color, talle, tipoDePrenda } = req.body;
  const newProducto = await Producto.create({
    nombre,
    cantidad,
    precio,
  });

  const promesas = [];

  promesas.push(
    asociarModelo(Color, color.nombre).then((color) =>
      newProducto.setColor(color),
    ),
  );
  promesas.push(
    asociarModelo(Talle, talle.nombre).then((talle) =>
      newProducto.setTalle(talle),
    ),
  );
  promesas.push(
    asociarModelo(TipoDePrenda, tipoDePrenda.nombre).then((tipo) =>
      newProducto.setTipoDePrenda(tipo),
    ),
  );

  await Promise.all(promesas);

  // Usar alias en include
  return res.status(201).json(await Producto.findByPk(newProducto.id, {
    include: [
      { model: Color, as: 'color' },
      { model: Talle, as: 'talle' },
      { model: TipoDePrenda, as: 'tipoDePrenda' },
    ],
  }));
};

//EDITAR CUANDO TERMINE STOCKPRODUCTO
//2. Actualizar un producto por su ID
const updateProducto = async (req, res) => {
  const { id } = req.params;
  const { nombre, cantidad, precio, color, talle, tipoDePrenda } = req.body;

  await Producto.update({ nombre, cantidad, precio }, { where: { id } });

  const producto = await Producto.findByPk(id);

  const promesas = [];

  if (color) {
    promesas.push(
      asociarModelo(Color, color.nombre).then((color) =>
        producto.setColor(color),
      ),
    );
  }

  if (talle) {
    promesas.push(
      asociarModelo(Talle, talle.nombre).then((talle) =>
        producto.setTalle(talle),
      ),
    );
  }

  if (tipoDePrenda) {
    promesas.push(
      asociarModelo(TipoDePrenda, tipoDePrenda.nombre).then((tipo) =>
        producto.setTipoDePrenda(tipo),
      ),
    );
  }

  await Promise.all(promesas);

  // Usar alias en include
  return res.status(200).json(await Producto.findByPk(id, {
    include: [
      { model: Color, as: 'color' },
      { model: Talle, as: 'talle' },
      { model: TipoDePrenda, as: 'tipoDePrenda' },
    ],
  }));
}

//3. Eliminar un producto por su ID
const deleteModel = genericControllers.deleteModel(Producto);

//4. Obtener todos los productos
const getAllProductos = async (req, res) => {
  const productos = await Producto.findAll({
    include: [
      { model: Color, as: 'color' },
      { model: Talle, as: 'talle' },
      { model: TipoDePrenda, as: 'tipoDePrenda' },
    ],
  });
  return res.status(200).json(productos);
};

//5. Obtener un producto por su ID
const getProductoById = async (req, res) => {
  const { id } = req.params;
  const producto = await Producto.findByPk(id, {
    include: [
      { model: Color, as: 'color' },
      { model: Talle, as: 'talle' },
      { model: TipoDePrenda, as: 'tipoDePrenda' },
    ],
  });
  return res.status(200).json(producto);
}

module.exports = {
  createProducto,
  updateProducto,
  deleteModel,
  getAllProductos,
  getProductoById
};