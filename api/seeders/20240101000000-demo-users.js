"use strict";

const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      {
        id: "9d2e6f5b-dbc2-4e7e-b2a6-1e1c3a4b5c6d",
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@db.com",
        passwordHash: await bcrypt.hash("johndoe", 10),
        isActive: true,
        isAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
