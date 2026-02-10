'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Talle extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Talle.hasMany(models.Producto, {
        foreignKey: 'colorId',
        as: 'productos'
      });
    }
  }
  Talle.init({
    nombre: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Talle',
    timestamps: false
  });
  return Talle;
};