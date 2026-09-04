'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('properties', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      company_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },

      title: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },

      property_type: {
        type: Sequelize.ENUM(
          'residential',
          'commercial',
          'plot',
          'land',
          'other'
        ),
        allowNull: false,
      },

      listing_type: {
        type: Sequelize.ENUM(
          'sale',
          'rent',
          'lease'
        ),
        allowNull: false,
        defaultValue: 'sale',
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      price: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
      },

      location: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      city: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      state: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      pincode: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },

      bedrooms: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      bathrooms: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      area: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: true,
      },

      area_unit: {
        type: Sequelize.ENUM(
          'sqft',
          'sqm',
          'sqyd',
          'acre',
          'bigha'
        ),
        allowNull: true,
        defaultValue: 'sqft',
      },

      amenities: {
        type: Sequelize.JSON,
        allowNull: true,
      },

      status: {
        type: Sequelize.ENUM(
          'available',
          'sold',
          'rented',
          'inactive'
        ),
        allowNull: false,
        defaultValue: 'available',
      },

      created_by: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
      },

      updated_by: {
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
    await queryInterface.dropTable('properties');
  },
};