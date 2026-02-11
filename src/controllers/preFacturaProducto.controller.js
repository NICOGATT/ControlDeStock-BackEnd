const { PreFacturaProducto, Producto, PreFactura } = require("../../db/models");

//1. Agregar productos a una prefactura
const awaitPreFacturaProducto = async (preFacturaId, productoId, cantidad) => {
  await PreFacturaProducto.create({
    preFacturaId,
    productoId,
    cantidad,
  });
};

const addProductsToPreFactura = async (req, res) => {
  const { elementos, preFacturaId } = req.body;

  const promesas = [];

  for (const elemento of elementos) {
    promesas.push(
      awaitPreFacturaProducto(
        preFacturaId,
        elemento.productoId,
        elemento.cantidad,
      ),
    );
  }

  await Promise.all(promesas);

  res.status(201).json(
    await PreFactura.findByPk(preFacturaId, {
      include: [
        {
          model: Producto,
          as: "productos",
          through: {
            attributes: ["cantidad"],
          },
        },
      ],
    }),
  );
};

//2. Editar productos de una prefactura por ID
const editPreFacturaProducto = async (req, res) => {
  const { productos, preFacturaId } = req.body;

  const promesas = productos.map(async (producto) => {
    const { productoId, cantidad } = producto;

    await PreFacturaProducto.update({
      cantidad,
    }, {
      where: { preFacturaId, productoId },
    });
  });

  await Promise.all(promesas);

  res.status(200).json(
    await PreFactura.findByPk(preFacturaId, {
      include: [
        {
          model: Producto,
          as: "productos",
          through: {
            attributes: ["cantidad"],
          },
        },
      ],
    }),
  );
};

//3. Eliminar productos de una prefactura por ID
const deletePreFacturaProducto = async (req, res) => {
  const { productos, preFacturaId } = req.body;

  const promesas = productos.map(async (producto) => {
    const { productoId } = producto;

    await PreFacturaProducto.destroy({
      where: { preFacturaId, productoId },
    });
  });

  await Promise.all(promesas);

  res.status(200).json({ message: "Productos eliminados correctamente." });
};

//4. Obtener productos de una prefactura
const getProductsFromPreFactura = async (req, res) => {
  const { preFacturaId } = req.params;

  const preFactura = await PreFactura.findByPk(preFacturaId, {
    include: [
      {
        model: Producto,
        as: "productos",
        through: {
          attributes: ["cantidad"],
        },
      },
    ],
  });

  res.status(200).json(preFactura.productos);
};

//5. Obtener todas las prefacturas con sus productos
const getAllPreFacturasWithProducts = async (req, res) => {
  const preFacturas = await PreFactura.findAll({
    include: [
      {
        model: Producto,
        as: "productos",
        through: {
          attributes: ["cantidad"],
        },
      },
    ],
  });

  res.status(200).json(preFacturas);
};

module.exports = {
  addProductsToPreFactura,
  editPreFacturaProducto,
  deletePreFacturaProducto,
  getProductsFromPreFactura,
  getAllPreFacturasWithProducts,
};
