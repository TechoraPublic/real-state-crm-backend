'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('site_visits', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      lead_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },

      property_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },

      assigned_to: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },

      scheduled_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      status: {
        type: Sequelize.ENUM(
          'scheduled',
          'confirmed',
          'completed',
          'cancelled',
          'no_show'
        ),
        allowNull: false,
        defaultValue: 'scheduled',
      },

      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      outcome: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      created_by: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('site_visits');
  },
};