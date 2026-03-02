'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PreFacturaProductos', {
      preFacturaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'PreFacturas',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      productoId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Productos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      talleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Talles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      colorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    
    await queryInterface.addConstraint('PreFacturaProductos', {
      fields: ['preFacturaId', 'productoId', 'talleId', 'colorId'],
      type: 'primary key',
      name: 'PK_PreFacturaProductos'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PreFacturaProductos');
  }
};