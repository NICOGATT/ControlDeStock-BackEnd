"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Color extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Color.belongsToMany(models.Producto, {
        through: "StockProducto",
        foreignKey: "colorId",
        otherKey: "productoId",
        as: "productos"
      });
      Color.hasMany(models.PreFacturaProducto, {
        foreignKey: "colorId",
        as: "prefacturaproductos",
      });
      Color.hasMany(models.StockProducto, {
        foreignKey: "colorId",
        as: "stockproductos",
      });
    }
  }
  Color.init(
    {
      nombre: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Color",
      tableName: "Colores",
      timestamps: false,
    },
  );
  return Color;
};
