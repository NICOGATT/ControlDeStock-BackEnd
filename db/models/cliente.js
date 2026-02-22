'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cliente extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Cliente.hasMany(models.PreFactura, { 
        foreignKey: 'clienteId', 
        as: 'prefacturas'
      });
      Cliente.hasMany(models.Direccion, {
        foreignKey: 'clienteId',
        as: 'direcciones'
      });
    }
  }
  Cliente.init({
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    telefono: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Cliente',
    timestamps: false
  });
  return Cliente;
};