"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Talle extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Talle.belongsToMany(models.Producto, {
        through: "StockProducto",
        foreignKey: "talleId",
        otherKey: "productoId",
        as: "productos",
      });
      Talle.hasMany(models.PreFacturaProducto, {
        foreignKey: "talleId",
        as: "prefacturaproductos",
      });
    }
  }
  Talle.init(
    {
      nombre: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Talle",
      timestamps: false,
    },
  );
  return Talle;
};
