'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('role_permissions', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      role_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,

        references: {
          model: 'roles',
          key: 'id',
        },

        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      permission_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,

        references: {
          model: 'permissions',
          key: 'id',
        },

        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active',
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

    await queryInterface.addIndex(
      'role_permissions',
      ['role_id', 'permission_id'],
      {
        unique: true,
        name: 'unique_role_permission',
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('role_permissions');
  },
};