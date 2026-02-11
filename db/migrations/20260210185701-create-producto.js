'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Productos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      cantidad: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      precio: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      colorId:{
        type: Sequelize.INTEGER,
        references: {
          model: 'Colores',
          key: 'id'
        },
      },
      talleId:{
        type: Sequelize.INTEGER,
        references: {
          model: 'Talles',
          key: 'id'
        },
      },
      tipoDePrendaId:{
        type: Sequelize.INTEGER,
        references: {
          model: 'TipoDePrendas',
          key: 'id'
        },
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Productos');
  }
};