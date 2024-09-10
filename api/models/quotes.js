"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Quotes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Quotes.belongsTo(models.Suppliers, {
        as: "supplier",
        foreignKey: "supplierId",
      });
      Quotes.belongsTo(models.PurchaseRequests, {
        as: "purchaseRequest",
        foreignKey: "purchaseRequestId",
      });
    }
  }
  Quotes.init(
    {
      supplierId: DataTypes.UUID,
      price: DataTypes.DECIMAL(10, 2),
      observation: DataTypes.TEXT,
      purchaseRequestId: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: "Quotes",
    }
  );
  return Quotes;
};
