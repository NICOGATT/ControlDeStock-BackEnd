'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('StockProductos', {
      productoId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'Productos',
          key: 'id'
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      talleId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'Talles',
          key: 'id'
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      colorId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'Colores',
          key: 'id'
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    });
    
    await queryInterface.addConstraint('StockProductos', {
      fields: ['productoId', 'talleId', 'colorId'],
      type: 'primary key',
      name: 'PK_StockProductos'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('StockProductos');
  }
};