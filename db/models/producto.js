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
      Producto.belongsTo(models.Color, {
        foreignKey: 'colorId',
        as: 'color'
      });
      Producto.belongsTo(models.Talle, {
        foreignKey: 'talleId',
        as: 'talle'
      });
      Producto.belongsTo(models.TipoDePrenda, {
        foreignKey: 'tipoDePrendaId',
        as: 'tipoDePrenda'
      });
    }
  }
  Producto.init({
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
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