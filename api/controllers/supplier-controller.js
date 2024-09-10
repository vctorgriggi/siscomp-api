const SupplierService = require("../services/supplier-service");

const supplierService = new SupplierService();

class SupplierController {
  static async create(req, res) {
    const { name, address, phone, email, cnpj } = req.body;

    try {
      await supplierService.create({
        name,
        address,
        phone,
        email,
        cnpj,
      });

      return res.status(201).send();
    } catch (error) {
      console.error("Controller error:", error.message);
      return res.status(400).send({ message: error.message });
    }
  }

  static async get(req, res) {
    try {
      const suppliers = await supplierService.get();

      res.status(200).json(suppliers);
    } catch (error) {
      console.error("Controller error:", error.message);
      return res.status(400).send({ message: error.message });
    }
  }

  static async getById(req, res) {
    const { id } = req.params;

    try {
      const supplier = await supplierService.getById(id);

      return res.status(200).json(supplier);
    } catch (error) {
      console.error("Controller error:", error.message);
      return res.status(400).send({ message: error.message });
    }
  }

  static async updateById(req, res) {
    const { id } = req.params;
    const { name, address, phone, email, cnpj } = req.body;

    try {
      const supplier = await supplierService.updateById({
        id,
        name,
        address,
        phone,
        email,
        cnpj,
      });

      return res.status(200).json(supplier);
    } catch (error) {
      console.error("Controller error:", error.message);
      return res.status(400).send({ message: error.message });
    }
  }

  static async deleteById(req, res) {
    const { id } = req.params;

    try {
      await supplierService.deleteById(id);

      return res.status(204).send();
    } catch (error) {
      console.error("Controller error:", error.message);
      return res.status(400).send({ message: error.message });
    }
  }
}

module.exports = SupplierController;
