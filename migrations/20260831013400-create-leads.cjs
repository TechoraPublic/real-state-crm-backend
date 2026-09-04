'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('leads', {
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

      customer_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'customers',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      assigned_to: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },

      property_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: 'properties',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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

      integration_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: 'integrations',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },

      source_lead_id: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },

      status: {
        type: Sequelize.ENUM(
          'new',
          'contacted',
          'qualified',
          'site_visit',
          'negotiation',
          'won',
          'lost',
          'on_hold'
        ),
        allowNull: false,
        defaultValue: 'new',
      },

      priority: {
        type: Sequelize.ENUM(
          'low',
          'medium',
          'high'
        ),
        allowNull: false,
        defaultValue: 'medium',
      },

      property_type: {
        type: Sequelize.ENUM(
          'residential',
          'commercial',
          'plot',
          'land',
          'other'
        ),
        allowNull: true,
      },

      budget_min: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
      },

      budget_max: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
      },

      preferred_location: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      requirements: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      lost_reason: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      created_at_source: {
        type: Sequelize.DATE,
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
      'leads',
      ['company_id']
    );

    await queryInterface.addIndex(
      'leads',
      ['customer_id']
    );

    await queryInterface.addIndex(
      'leads',
      ['assigned_to']
    );

    await queryInterface.addIndex(
      'leads',
      ['property_id']
    );

    await queryInterface.addIndex(
      'leads',
      ['lead_source_id']
    );

    await queryInterface.addIndex(
      'leads',
      ['integration_id']
    );

    await queryInterface.addIndex(
      'leads',
      ['status']
    );

    await queryInterface.addIndex(
      'leads',
      ['priority']
    );

    await queryInterface.addIndex(
      'leads',
      ['source_lead_id']
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('leads');
  },
};