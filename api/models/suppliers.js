"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Suppliers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Suppliers.hasMany(models.Quotes, {
        as: "quotes",
        foreignKey: "supplierId",
      });
      Suppliers.hasMany(models.Contacts, {
        as: "contacts",
        foreignKey: "supplierId",
      });
    }
  }
  Suppliers.init(
    {
      name: DataTypes.STRING,
      address: DataTypes.TEXT,
      phone: DataTypes.STRING,
      email: DataTypes.STRING,
      cnpj: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Suppliers",
    }
  );
  return Suppliers;
};
