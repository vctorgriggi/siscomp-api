const ProductService = require("../services/product-service");
const deleteFromS3 = require("../utils/delete-s3-file");

const productService = new ProductService();

class ProductController {
  static async create(req, res) {
    const { name, description, productCategoryId } = req.body;
    const imageUrl = req.file ? req.file.location : null;

    try {
      await productService.create({
        name,
        imageUrl,
        description,
        productCategoryId,
      });

      return res.status(201).send();
    } catch (error) {
      if (imageUrl) await deleteFromS3(imageUrl);
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
    const { name, description, productCategoryId } = req.body;
    const imageUrl = req.file ? req.file.location : null;

    try {
      const current = await productService.getById(id);

      const updated = await productService.updateById({
        id,
        name,
        imageUrl,
        description,
        productCategoryId,
      });

      if (current.imageUrl && imageUrl) {
        await deleteFromS3(current.imageUrl);
      }

      return res.status(200).json(updated);
    } catch (error) {
      if (imageUrl) await deleteFromS3(imageUrl);
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
        await deleteFromS3(product.imageUrl);
      }

      return res.status(204).send();
    } catch (error) {
      console.error("Controller error:", error.message);
      return res.status(400).send({ message: error.message });
    }
  }

  static async deleteImage(req, res) {
    const { id } = req.params;

    try {
      const current = await productService.getById(id);

      const updated = await productService.deleteImage(id);

      await deleteFromS3(current.imageUrl);

      return res.status(200).json(updated);
    } catch (error) {
      console.error("Controller error:", error.message);
      return res.status(400).send({ message: error.message });
    }
  }
}

module.exports = ProductController;
