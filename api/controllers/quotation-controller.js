const QuotationService = require("../services/quotation-service");

const quotationService = new QuotationService();

class QuotationController {
  static async create(req, res) {
    const { supplierId, price, observation, purchaseRequestId } = req.body;

    try {
      await quotationService.create({
        supplierId,
        price,
        observation,
        purchaseRequestId,
      });

      return res.status(201).send();
    } catch (error) {
      console.error("Controller error:", error.message);
      return res.status(400).send({ message: error.message });
    }
  }

  static async get(req, res) {
    try {
      const quotes = await quotationService.get();

      res.status(200).json(quotes);
    } catch (error) {
      console.error("Controller error:", error.message);
      return res.status(400).send({ message: error.message });
    }
  }

  static async getById(req, res) {
    const { id } = req.params;

    try {
      const quotation = await quotationService.getById(id);

      return res.status(200).json(quotation);
    } catch (error) {
      console.error("Controller error:", error.message);
      return res.status(400).send({ message: error.message });
    }
  }

  static async deleteById(req, res) {
    const { id } = req.params;

    try {
      await quotationService.deleteById(id);

      return res.status(204).send();
    } catch (error) {
      console.error("Controller error:", error.message);
      return res.status(400).send({ message: error.message });
    }
  }
}

module.exports = QuotationController;
