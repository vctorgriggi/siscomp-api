"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("PurchaseRequests", {
      id: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      productId: {
        type: Sequelize.UUID,
        references: {
          model: "Products",
          key: "id",
        },
        onDelete: "NO ACTION",
        onUpdate: "CASCADE",
      },
      quantity: {
        type: Sequelize.INTEGER,
      },
      validity: {
        type: Sequelize.DATE,
      },
      observation: {
        type: Sequelize.TEXT,
      },
      status: {
        allowNull: false,
        defaultValue: "open",
        type: Sequelize.ENUM("open", "in_quote", "quoted"),
      },
      userId: {
        type: Sequelize.UUID,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "NO ACTION",
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
    await queryInterface.dropTable("PurchaseRequests");
  },
};
