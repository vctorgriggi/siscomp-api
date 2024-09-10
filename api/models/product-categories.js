"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductCategories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProductCategories.hasMany(models.Products, {
        as: "products",
        foreignKey: "productCategoryId",
      });
    }
  }
  ProductCategories.init(
    {
      name: DataTypes.STRING,
      imageUrl: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "ProductCategories",
    }
  );
  return ProductCategories;
};
