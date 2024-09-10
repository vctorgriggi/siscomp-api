"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Products.belongsTo(models.ProductCategories, {
        as: "productCategory",
        foreignKey: "productCategoryId",
      });
      Products.hasMany(models.PurchaseRequests, {
        as: "purchaseRequests",
        foreignKey: "productId",
      });
    }
  }
  Products.init(
    {
      name: DataTypes.STRING,
      imageUrl: DataTypes.TEXT,
      description: DataTypes.TEXT,
      productCategoryId: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: "Products",
    }
  );
  return Products;
};
