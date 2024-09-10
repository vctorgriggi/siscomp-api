"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Contacts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Contacts.belongsTo(models.Suppliers, {
        as: "supplier",
        foreignKey: "supplierId",
      });
    }
  }
  Contacts.init(
    {
      name: DataTypes.STRING,
      phone: DataTypes.STRING,
      email: DataTypes.STRING,
      role: DataTypes.STRING,
      supplierId: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: "Contacts",
    }
  );
  return Contacts;
};
