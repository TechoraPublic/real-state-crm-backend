'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('customers', 'company_id', {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: true,
      references: {
        model: 'companies',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    await queryInterface.addIndex('customers', ['company_id'], {
      name: 'idx_customers_company_id',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex(
      'customers',
      'idx_customers_company_id'
    );

    await queryInterface.removeColumn('customers', 'company_id');
  },
};