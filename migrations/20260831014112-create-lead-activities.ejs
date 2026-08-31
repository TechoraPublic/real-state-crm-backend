'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('lead_activities', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      lead_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'leads',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      user_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },

      type: {
        type: Sequelize.ENUM(
          'note',
          'call',
          'email',
          'whatsapp',
          'status_change',
          'assignment',
          'followup',
          'site_visit',
          'property_view',
          'deal'
        ),
        allowNull: false,
      },

      title: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      metadata: {
        type: Sequelize.JSON,
        allowNull: true,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Indexes
    await queryInterface.addIndex(
      'lead_activities',
      ['lead_id']
    );

    await queryInterface.addIndex(
      'lead_activities',
      ['user_id']
    );

    await queryInterface.addIndex(
      'lead_activities',
      ['type']
    );

    await queryInterface.addIndex(
      'lead_activities',
      ['created_at']
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('lead_activities');
  },
};