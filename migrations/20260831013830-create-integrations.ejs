'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('integrations', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      company_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'companies',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      lead_source_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'lead_sources',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },

      name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },

      platform: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      config: {
        type: Sequelize.JSON,
        allowNull: true,
      },

      status: {
        type: Sequelize.ENUM(
          'active',
          'inactive',
          'error'
        ),
        allowNull: false,
        defaultValue: 'inactive',
      },

      last_synced_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      last_error: {
        type: Sequelize.TEXT,
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
        defaultValue: Sequelize.literal(
          'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
        ),
      },
    });

    // Indexes
    await queryInterface.addIndex(
      'integrations',
      ['company_id']
    );

    await queryInterface.addIndex(
      'integrations',
      ['lead_source_id']
    );

    await queryInterface.addIndex(
      'integrations',
      ['platform']
    );

    await queryInterface.addIndex(
      'integrations',
      ['status']
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('integrations');
  },
};