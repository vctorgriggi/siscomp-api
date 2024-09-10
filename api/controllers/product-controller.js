const ProductService = require("../services/product-service");
const deleteFile = require("../utils/delete-file");

const productService = new ProductService();

class ProductController {
  static async create(req, res) {
    const { name, description, productCategoryId } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    try {
      await productService.create({
        name,
        imageUrl,
        description,
        productCategoryId,
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
      const products = await productService.get();

      res.status(200).json(products);
    } catch (error) {
      console.error("Controller error:", error.message);
      return res.status(400).send({ message: error.message });
    }
  }

  static async getById(req, res) {
    const { id } = req.params;

    try {
      const product = await productService.getById(id);

      return res.status(200).json(product);
    } catch (error) {
      console.error("Controller error:", error.message);
      return res.status(400).send({ message: error.message });
    }
  }

  static async updateById(req, res) {
    const { id } = req.params;
    const { name, description, productCategoryId, unsetImage } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    try {
      const existing = await productService.getById(id);

      const toUpdate = { id, name, description, productCategoryId };

      if (imageUrl) {
        toUpdate.imageUrl = imageUrl;
      } else if (unsetImage) {
        toUpdate.imageUrl = null;
      }

      const updated = await productService.updateById(toUpdate);

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
      const product = await productService.getById(id);

      await productService.deleteById(id);

      if (product.imageUrl) {
        deleteFile(product.imageUrl);
      }

      return res.status(204).send();
    } catch (error) {
      console.error("Controller error:", error.message);
      return res.status(400).send({ message: error.message });
    }
  }
}

module.exports = ProductController;
