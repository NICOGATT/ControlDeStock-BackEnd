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
      PreFacturaProducto.belongsTo(models.Color, {
        foreignKey: "colorId",
        as: "color",
      });
      PreFacturaProducto.belongsTo(models.Talle, {
        foreignKey: "talleId",
        as: "talle",
      });
    }
  }
  PreFacturaProducto.init(
    {
      preFacturaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      productoId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      talleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      colorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
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
      indexes: [
        {
          unique: true,
          fields: ["preFacturaId", "productoId", "talleId", "colorId"],
          name: "PK_PreFacturaProductos",
        },
      ],
      timestamps: false,
    },
  );
  return PreFacturaProducto;
};
