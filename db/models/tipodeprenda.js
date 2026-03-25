'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TipoDePrenda extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TipoDePrenda.hasMany(models.Producto, {
        foreignKey: 'tipoDePrendaId',
        as: 'productos'
      });
    }
  }
  TipoDePrenda.init({
    nombre: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'TipoDePrenda',
    timestamps: false
  });
  return TipoDePrenda;
};