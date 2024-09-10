"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Quotes", {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      supplierId: {
        type: Sequelize.UUID,
        references: {
          model: "Suppliers",
          key: "id",
        },
        onDelete: "NO ACTION",
        onUpdate: "CASCADE",
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
      },
      observation: {
        type: Sequelize.TEXT,
      },
      purchaseRequestId: {
        type: Sequelize.UUID,
        references: {
          model: "PurchaseRequests",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Quotes");
  },
};
