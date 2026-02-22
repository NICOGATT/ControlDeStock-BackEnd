"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Direccion extends Model {
    static associate(models) {
      Direccion.belongsTo(models.Cliente, 
        { 
          foreignKey: "clienteId",
          as: "cliente"
        }
      );
    }
  }
  Direccion.init(
    {
      direccion: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      clienteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "Direccion",
      tableName: "Direcciones",
      timestamps: false
    },
  );
  return Direccion;
};
