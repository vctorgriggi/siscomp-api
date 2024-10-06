const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");

const database = require("../models");

class ProductService {
  async create(dto) {
    if (dto.productCategoryId) {
      const productCategory = await database.ProductCategories.findByPk(
        dto.productCategoryId
      );

      if (!productCategory) {
        throw new Error("Product category not found.");
      }
    }

    const byName = await database.Products.findOne({
      where: {
        name: { [Op.iLike]: dto.name },
      },
    });

    if (byName) {
      throw new Error("There is already a product with this name.");
    }

    try {
      const newProduct = await database.Products.create({
        id: uuidv4(),
        name: dto.name,
        imageUrl: dto.imageUrl,
        description: dto.description,
        productCategoryId: dto.productCategoryId,
      });

      return newProduct;
    } catch (error) {
      console.error("Service error:", error.message);
      throw error;
    }
  }

  async get() {
    const products = await database.Products.findAll({
      include: [
        {
          model: database.ProductCategories,
          as: "productCategory",
        },
      ],
    });

    return products;
  }

  async getById(id) {
    const product = await database.Products.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: database.ProductCategories,
          as: "productCategory",
        },
        {
          model: database.PurchaseRequests,
          as: "purchaseRequests",
        },
      ],
    });

    if (!product) {
      throw new Error("Product not found.");
    }

    return product;
  }

  async updateById(dto) {
    const product = await database.Products.findOne({
      where: {
        id: dto.id,
      },
    });

    if (!product) {
      throw new Error("Product not found.");
    }

    if (dto.productCategoryId) {
      const productCategory = await database.ProductCategories.findByPk(
        dto.productCategoryId
      );

      if (!productCategory) {
        throw new Error("Product category not found.");
      }
    }

    const byName = await database.Products.findOne({
      where: {
        name: { [Op.iLike]: dto.name },
        id: { [Op.ne]: dto.id },
      },
    });

    if (byName) {
      throw new Error("There is already a product with this name.");
    }

    try {
      product.name = dto.name;
      if (dto.imageUrl) product.imageUrl = dto.imageUrl; // update image only if a new one is provided
      product.description = dto.description;
      product.productCategoryId = dto.productCategoryId;

      await product.save();

      return await product.reload();
    } catch (error) {
      console.error("Service error:", error.message);
      throw error;
    }
  }

  async deleteById(id) {
    const product = await database.Products.findOne({
      where: {
        id: id,
      },
    });

    if (!product) {
      throw new Error("Product not found.");
    }

    try {
      await database.Products.destroy({
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
    const product = await database.ProductCategories.findOne({
      where: {
        id: id,
      },
    });

    if (!product) {
      throw new Error("Product not found.");
    }

    if (!product.imageUrl) {
      throw new Error("Image not found.");
    }

    try {
      product.imageUrl = null;

      await product.save();

      return await product.reload();
    } catch (error) {
      console.error("Service error:", error.message);
      throw error;
    }
  }
}

module.exports = ProductService;
