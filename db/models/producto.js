'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Producto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Producto.belongsToMany(models.Color, {
        through: "StockProducto",
        foreignKey: "productoId",
        otherKey: "colorId",
        as: "colores"
      });
      Producto.belongsTo(models.TipoDePrenda, {
        foreignKey: 'tipoDePrendaId',
        as: 'tipoDePrenda'
      });
      Producto.belongsToMany(models.PreFactura, { 
        through: "PreFacturaProducto",
        foreignKey: "productoId",
        otherKey: "preFacturaId",
        as: "prefacturas"
      });
      Producto.belongsToMany(models.Talle, { 
        through: "StockProducto",
        foreignKey: "productoId",
        otherKey: "talleId",
        as: "talles"
      });
    }
  }
  Producto.init({
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    precio: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Producto',
    timestamps: false
  });
  return Producto;
};