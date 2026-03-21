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
      Direccion.hasMany(models.PreFactura, {
        foreignKey: "direccionId",
        as: "prefacturas"
      });
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
      codigoPostal: {
        type: DataTypes.STRING,
        allowNull: false
      },
      ciudad: {
        type: DataTypes.STRING,
        allowNull: false
      },
      provincia: {
        type: DataTypes.STRING,
        allowNull: false
      }
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
