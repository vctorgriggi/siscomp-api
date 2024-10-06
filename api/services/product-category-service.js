const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");

const database = require("../models");

class ProductCategoryService {
  async create(dto) {
    const byName = await database.ProductCategories.findOne({
      where: {
        name: { [Op.iLike]: dto.name },
      },
    });

    if (byName) {
      throw new Error("There is already a product category with this name.");
    }

    try {
      const newProductCategory = await database.ProductCategories.create({
        id: uuidv4(),
        name: dto.name,
        imageUrl: dto.imageUrl,
      });

      return newProductCategory;
    } catch (error) {
      console.error("Service error:", error.message);
      throw error;
    }
  }

  async get() {
    const productCategories = await database.ProductCategories.findAll();

    return productCategories;
  }

  async getById(id) {
    const productCategory = await database.ProductCategories.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: database.Products,
          as: "products",
        },
      ],
    });

    if (!productCategory) {
      throw new Error("Product category not found.");
    }

    return productCategory;
  }

  async updateById(dto) {
    const productCategory = await database.ProductCategories.findOne({
      where: {
        id: dto.id,
      },
    });

    if (!productCategory) {
      throw new Error("Product category not found.");
    }

    const byName = await database.ProductCategories.findOne({
      where: {
        name: { [Op.iLike]: dto.name },
        id: { [Op.ne]: dto.id },
      },
    });

    if (byName) {
      throw new Error("There is already a product category with this name.");
    }

    try {
      productCategory.name = dto.name;
      if (dto.imageUrl) productCategory.imageUrl = dto.imageUrl; // update image only if a new one is provided

      await productCategory.save();

      return await productCategory.reload();
    } catch (error) {
      console.error("Service error:", error.message);
      throw error;
    }
  }

  async deleteById(id) {
    const productCategory = await database.ProductCategories.findOne({
      where: {
        id: id,
      },
    });

    if (!productCategory) {
      throw new Error("Product category not found.");
    }

    try {
      await database.ProductCategories.destroy({
        where: {
          id: id,
        },
      });
    } catch (error) {
      console.error("Service error:", error.message);
      throw error;
    }
  }

  async deleteImage(id) {
    const productCategory = await database.ProductCategories.findOne({
      where: {
        id: id,
      },
    });

    if (!productCategory) {
      throw new Error("Product category not found.");
    }

    if (!productCategory.imageUrl) {
      throw new Error("Image not found.");
    }

    try {
      productCategory.imageUrl = null;

      await productCategory.save();

      return await productCategory.reload();
    } catch (error) {
      console.error("Service error:", error.message);
      throw error;
    }
  }
}

module.exports = ProductCategoryService;
