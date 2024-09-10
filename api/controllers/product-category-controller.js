const ProductCategoryService = require("../services/product-category-service");
const deleteFile = require("../utils/delete-file");

const productCategoryService = new ProductCategoryService();

class ProductCategoryController {
  static async create(req, res) {
    const { name } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    try {
      await productCategoryService.create({
        name,
        imageUrl,
      });

      return res.status(201).send();
    } catch (error) {
      if (imageUrl) deleteFile(imageUrl);
      console.error("Controller error:", error.message);
      return res.status(400).send({ message: error.message });
    }
  }

  static async get(req, res) {
    try {
      const productCategories = await productCategoryService.get();

      return res.status(200).json(productCategories);
    } catch (error) {
      console.error("Controller error:", error.message);
      return res.status(400).send({ message: error.message });
    }
  }

  static async getById(req, res) {
    const { id } = req.params;

    try {
      const productCategory = await productCategoryService.getById(id);

      return res.status(200).json(productCategory);
    } catch (error) {
      console.error("Controller error:", error.message);
      return res.status(400).send({ message: error.message });
    }
  }

  static async updateById(req, res) {
    const { id } = req.params;
    const { name, unsetImage } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    try {
      const existing = await productCategoryService.getById(id);

      const toUpdate = { id, name };

      if (imageUrl) {
        toUpdate.imageUrl = imageUrl;
      } else if (unsetImage) {
        toUpdate.imageUrl = null;
      }

      const updated = await productCategoryService.updateById(toUpdate);

      if (existing.imageUrl && (imageUrl || unsetImage)) {
        deleteFile(existing.imageUrl);
      }

      return res.status(200).json(updated);
    } catch (error) {
      if (imageUrl) deleteFile(imageUrl);
      console.error("Controller error:", error.message);
      return res.status(400).send({ message: error.message });
    }
  }

  static async deleteById(req, res) {
    const { id } = req.params;

    try {
      const productCategory = await productCategoryService.getById(id);

      await productCategoryService.deleteById(id);

      if (productCategory.imageUrl) {
        deleteFile(productCategory.imageUrl);
      }

      return res.status(204).send();
    } catch (error) {
      console.error("Controller error:", error.message);
      return res.status(400).send({ message: error.message });
    }
  }
}

module.exports = ProductCategoryController;
