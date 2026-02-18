'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PreFacturaProductos', {
      preFacturaId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'PreFacturas',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      productoId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'Productos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      talleId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'Talles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      colorId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'Colores',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      cantidad: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PreFacturaProductos');
  }
};