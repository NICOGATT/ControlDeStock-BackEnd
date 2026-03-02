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
      Producto.belongsTo(models.TipoDePrenda, {
        foreignKey: 'tipoDePrendaId',
        as: 'tipoDePrenda'
      });
      Producto.hasMany(models.PreFacturaProducto, { 
        foreignKey: "productoId",
        as: "prefacturas"
      });
      Producto.hasMany(models.StockProducto, {
        foreignKey: "productoId",
        as: "stockProductos",
      });
    }
  }
  Producto.init({
    id:{
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true
    },
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