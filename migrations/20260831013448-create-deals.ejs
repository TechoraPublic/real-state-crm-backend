'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('deals', {
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

      property_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'properties',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      assigned_to: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },

      deal_value: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
      },

      stage: {
        type: Sequelize.ENUM(
          'initial',
          'negotiation',
          'documentation',
          'closed'
        ),
        allowNull: false,
        defaultValue: 'initial',
      },

      status: {
        type: Sequelize.ENUM(
          'open',
          'won',
          'lost',
          'cancelled'
        ),
        allowNull: false,
        defaultValue: 'open',
      },

      expected_close_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      closed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      lost_reason: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      created_by: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },

      updated_by: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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

    // Useful indexes for CRM queries
    await queryInterface.addIndex('deals', ['company_id']);
    await queryInterface.addIndex('deals', ['lead_id']);
    await queryInterface.addIndex('deals', ['customer_id']);
    await queryInterface.addIndex('deals', ['property_id']);
    await queryInterface.addIndex('deals', ['assigned_to']);
    await queryInterface.addIndex('deals', ['status']);
    await queryInterface.addIndex('deals', ['stage']);
    await queryInterface.addIndex('deals', ['expected_close_date']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('deals');
  },
};