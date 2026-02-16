const { Producto, Color, Talle, TipoDePrenda, StockProducto } = require("../../db/models");
const genericControllers = require("./generic.controller");

//1. Crear un nuevo producto
const crearStock = async (modeloColor, valorColor, modeloTalle, valorTalle, productoId, stock) => {
  const color = await modeloColor.findOrCreate({ where: { nombre: valorColor } });
  const talle = await modeloTalle.findOrCreate({ where: { nombre: valorTalle } });
  await StockProducto.create({
    productoId,
    colorId: color[0].id, 
    talleId: talle[0].id, 
    stock: stock,
  });
};

//EDITAR CUANDO TERMINE STOCKPRODUCTO
const createProducto = async (req, res) => {
  const { colorYTalle, nombre, precio } = req.body;
  const newProducto = await Producto.create({
    nombre,
    precio,
  });

  const promesas = colorYTalle.map(async (item) => {
    await crearStock(Color, item.color, Talle, item.talle, newProducto.id, item.cantidad);
  });

  await Promise.all(promesas);

  await TipoDePrenda.findOrCreate({ 
    where: { nombre: req.body.tipoDePrenda } 
  }).then(([tipo]) => newProducto.setTipoDePrenda(tipo));

  const responseProducto = await Producto.findByPk(newProducto.id, {
      include: [
        {
          model: StockProducto,
          as: "stockProductos",
          attributes: ["stock"],
          include: [
            { model: Color, as: "color", attributes: ["nombre"] },
            { model: Talle, as: "talle", attributes: ["nombre"] },
          ],
        },
        { model: TipoDePrenda, as: "tipoDePrenda" },
      ],
    })

  return res.status(201).json(responseProducto);
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
  return res.status(200).json(
    await Producto.findByPk(id, {
      include: [
        { model: Color, as: "color" },
        { model: Talle, as: "talle" },
        { model: TipoDePrenda, as: "tipoDePrenda" },
      ],
    }),
  );
};

//3. Eliminar un producto por su ID
const deleteModel = genericControllers.deleteModel(Producto);

//4. Obtener todos los productos
const getAllProductos = async (req, res) => {
  const productos = await Producto.findAll({
    include: [
      { model: Color, as: "color" },
      { model: Talle, as: "talle" },
      { model: TipoDePrenda, as: "tipoDePrenda" },
    ],
  });
  return res.status(200).json(productos);
};

//5. Obtener un producto por su ID
const getProductoById = async (req, res) => {
  const { id } = req.params;
  const producto = await Producto.findByPk(id, {
    include: [
      { model: Color, as: "color" },
      { model: Talle, as: "talle" },
      { model: TipoDePrenda, as: "tipoDePrenda" },
    ],
  });
  return res.status(200).json(producto);
};

module.exports = {
  createProducto,
  updateProducto,
  deleteModel,
  getAllProductos,
  getProductoById,
};
