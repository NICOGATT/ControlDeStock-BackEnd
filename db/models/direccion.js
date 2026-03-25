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
        allowNull: true,
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
        allowNull: true
      },
      ciudad: {
        type: DataTypes.STRING,
        allowNull: true
      },
      provincia: {
        type: DataTypes.STRING,
        allowNull: true
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
