"use strict";
const { allow } = require("joi");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StockProducto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      StockProducto.belongsTo(models.Producto, {
        foreignKey: "productoId",
        as: "producto",
      });
      StockProducto.belongsTo(models.Talle, {
        foreignKey: "talleId",
        as: "talle",
      });
    }
  }
  StockProducto.init(
    {
      productoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      talleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "StockProducto",
      timestamps: false
    },
  );
  return StockProducto;
};
