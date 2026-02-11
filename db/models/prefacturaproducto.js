"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PreFacturaProducto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PreFacturaProducto.belongsTo(models.PreFactura, {
        foreignKey: "preFacturaId",
        as: "prefactura",
      });
      PreFacturaProducto.belongsTo(models.Producto, {
        foreignKey: "productoId",
        as: "producto",
      });
    }
  }
  PreFacturaProducto.init(
    {
      preFacturaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      productoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "PreFacturaProducto",
      timestamps: false,
    },
  );
  return PreFacturaProducto;
};
