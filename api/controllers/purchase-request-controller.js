const PurchaseRequestService = require("../services/purchase-request-service");

const purchaseRequestService = new PurchaseRequestService();

class PurchaseRequestController {
  static async create(req, res) {
    const { userId } = req;
    const { productId, quantity, validity, observation } = req.body;

    try {
      await purchaseRequestService.create({
        productId,
        quantity,
        validity,
        observation,
        userId,
      });

      return res.status(201).send();
    } catch (error) {
      console.error("Controller error:", error.message);
      return res.status(400).send({ message: error.message });
    }
  }

  static async get(req, res) {
    const { userId } = req;

    try {
      const purchaseRequests = await purchaseRequestService.get(userId);

      return res.status(200).json(purchaseRequests);
    } catch (error) {
      console.error("Controller error:", error.message);
      return res.status(400).send({ message: error.message });
    }
  }

  static async getById(req, res) {
    const { userId } = req;
    const { id } = req.params;

    try {
      const purchaseRequest = await purchaseRequestService.getById({
        id,
        userId,
      });

      return res.status(200).json(purchaseRequest);
    } catch (error) {
      console.error("Controller error:", error.message);
      return res.status(400).send({ message: error.message });
    }
  }

  static async deleteById(req, res) {
    const { userId } = req;
    const { id } = req.params;

    try {
      await purchaseRequestService.deleteById({ id, userId });

      return res.status(204).send();
    } catch (error) {
      console.error("Controller error:", error.message);
      return res.status(400).send({ message: error.message });
    }
  }
}

module.exports = PurchaseRequestController;
