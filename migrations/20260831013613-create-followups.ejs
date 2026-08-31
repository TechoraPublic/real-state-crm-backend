'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('followups', {
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

      type: {
        type: Sequelize.ENUM(
          'call',
          'whatsapp',
          'email',
          'meeting',
          'reminder',
          'other'
        ),
        allowNull: false,
        defaultValue: 'call',
      },

      title: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      scheduled_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      status: {
        type: Sequelize.ENUM(
          'pending',
          'completed',
          'cancelled',
          'overdue'
        ),
        allowNull: false,
        defaultValue: 'pending',
      },

      completed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      outcome: {
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

    // Indexes for faster CRM queries
    await queryInterface.addIndex('followups', ['lead_id']);
    await queryInterface.addIndex('followups', ['assigned_to']);
    await queryInterface.addIndex('followups', ['scheduled_at']);
    await queryInterface.addIndex('followups', ['status']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('followups');
  },
};