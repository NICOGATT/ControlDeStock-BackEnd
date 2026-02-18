const { PreFacturaProducto, Producto, PreFactura, Color, Talle ,Cliente} = require("../../db/models");

//1. Agregar productos a una prefactura
const addProductsToPreFactura = async (req, res) => {
  const { productos, preFacturaId } = req.body;
  
  const promesas = productos.map((elemento) =>
    PreFacturaProducto.create({
      preFacturaId,
      productoId: elemento.productoId,
      talleId: elemento.talleId,
      colorId: elemento.colorId,
      cantidad: elemento.cantidad,
    })
  );

  await Promise.all(promesas);

  const productosPreFactura = await PreFacturaProducto.findAll({
    where: { preFacturaId },
    attributes: ["cantidad"],
    include: [
      {
        model: Producto,
        as: "producto",
        attributes: ["id", "nombre"],
      },
      {
        model: Color,
        as: "color",
        attributes: ["id", "nombre"],
      },
      {
        model: Talle,
        as: "talle",
        attributes: ["id", "nombre"],
      }
    ],

  })

  res.status(201).json({
    preFactura: await PreFactura.findByPk(preFacturaId),
    productos: productosPreFactura
  });
};

//2. Editar productos de una prefactura por ID
const editPreFacturaProducto = async (req, res) => {
  const { productos, preFacturaId } = req.body;

  const promesas = productos.map(async (producto) => {
    const { productoId, colorId, talleId, cantidad } = producto;

    await PreFacturaProducto.update({
      cantidad,
    }, {
      where: { preFacturaId, productoId, colorId, talleId },
    });
  });

  await Promise.all(promesas);

  const productosPreFactura = await PreFacturaProducto.findAll({
    where: { preFacturaId },
    attributes: ["cantidad"],
    include: [
      {
        model: Producto,
        as: "producto",
        attributes: ["id", "nombre"],
      },
      {
        model: Color,
        as: "color",
        attributes: ["id", "nombre"],
      },
      {
        model: Talle,
        as: "talle",
        attributes: ["id", "nombre"],
      }
    ],

  })

  res.status(201).json({
    preFactura: await PreFactura.findByPk(preFacturaId),
    productos: productosPreFactura
  });
};

//3. Eliminar productos de una prefactura por ID
const deletePreFacturaProducto = async (req, res) => {
  const { productos, preFacturaId } = req.body;

  const promesas = productos.map(async (producto) => {
    const { productoId, talleId, colorId } = producto;

    await PreFacturaProducto.destroy({
      where: { preFacturaId, productoId, talleId, colorId },
    });
  });

  await Promise.all(promesas);

  res.status(204).send();
};


//4. Obtener todas las prefacturas con sus productos
const getAllPreFacturasWithProducts = async (_, res) => {
  const preFacturas = await PreFactura.findAll({
    attributes: ["id", "fecha"],
    include: [
      {
        model: Cliente,
        as: "cliente",
        attributes: ["id", "nombre"],
      },
      {
        model: PreFacturaProducto,
        as: "productos",
        attributes: ["cantidad"],
        include: [
          {
            model: Producto,
            as: "producto",
            attributes: ["id", "nombre", "precio"],
          },
          {
            model: Color,
            as: "color",
            attributes: ["id", "nombre"],
          },
          {
            model: Talle,
            as: "talle",
            attributes: ["id", "nombre"],
          }
        ],
      }
    ],
  });
  
  res.status(200).json(preFacturas);
};

//5. Obtener productos de una prefactura
const getPreFacturaWithProducts = async (req, res) => {
  const { id } = req.params;

  const preFactura = await PreFactura.findByPk(id, {
    attributes: ["id", "fecha"],
    include: [
      {
        model: Cliente,
        as: "cliente",
        attributes: ["id", "nombre"],
      },
      {
        model: PreFacturaProducto,
        as: "productos",
        attributes: ["cantidad"],
        include: [
          {
            model: Producto,
            as: "producto",
            attributes: ["id", "nombre", "precio"],
          },
          {
            model: Color,
            as: "color",
            attributes: ["id", "nombre"],
          },
          {
            model: Talle,
            as: "talle",
            attributes: ["id", "nombre"],
          }
        ],
      }
    ],
  });

  res.status(200).json(preFactura);
};

module.exports = {
  addProductsToPreFactura,
  editPreFacturaProducto,
  deletePreFacturaProducto,
  getPreFacturaWithProducts,
  getAllPreFacturasWithProducts,
};
