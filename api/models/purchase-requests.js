"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PurchaseRequests extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PurchaseRequests.belongsTo(models.Products, {
        as: "product",
        foreignKey: "productId",
      });
      PurchaseRequests.belongsTo(models.Users, {
        as: "user",
        foreignKey: "userId",
      });
      PurchaseRequests.hasMany(models.Quotes, {
        as: "quotes",
        foreignKey: "purchaseRequestId",
      });
    }
  }
  PurchaseRequests.init(
    {
      productId: DataTypes.UUID,
      quantity: DataTypes.INTEGER,
      validity: DataTypes.DATE,
      observation: DataTypes.TEXT,
      status: DataTypes.ENUM("open", "in_quote", "quoted"),
      userId: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: "PurchaseRequests",
    }
  );
  return PurchaseRequests;
};
