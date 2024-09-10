const { v4: uuidv4 } = require("uuid");

const database = require("../models");

class PurchaseRequestService {
  async create(dto) {
    if (!dto.userId) {
      throw new Error("A purchase request cannot be created without a user.");
    }

    if (dto.productId) {
      const product = await database.Products.findByPk(dto.productId);

      if (!product) {
        throw new Error("Product category not found.");
      }
    }

    const user = await database.Users.findByPk(dto.userId);

    if (!user) {
      throw new Error("User not found.");
    }

    try {
      const newPurchaseRequest = await database.PurchaseRequests.create({
        id: uuidv4(),
        productId: dto.productId,
        quantity: dto.quantity,
        validity: dto.validity,
        observation: dto.observation,
        userId: dto.userId,
      });

      return newPurchaseRequest;
    } catch (error) {
      console.error("Service error:", error.message);
      throw error;
    }
  }

  async get(userId) {
    const user = await database.Users.findByPk(userId);

    if (!user) {
      throw new Error("User not found.");
    }

    const queryOptions = {
      include: [
        {
          model: database.Products,
          as: "product",
        },
        {
          model: database.Users,
          as: "user",
        },
      ],
    };

    /* RN: non-admin users can only see their own purchase requests */
    if (!user.isAdmin) {
      queryOptions.where = {
        userId,
      };
    }

    const purchaseRequests = await database.PurchaseRequests.findAll(
      queryOptions
    );

    return purchaseRequests;
  }

  async getById(dto) {
    const user = await database.Users.findByPk(dto.userId);

    if (!user) {
      throw new Error("User not found.");
    }

    const purchaseRequest = await database.PurchaseRequests.findOne({
      where: {
        id: dto.id,
      },
      include: [
        {
          model: database.Products,
          as: "product",
        },
        {
          model: database.Users,
          as: "user",
        },
        {
          model: database.Quotes,
          as: "quotes",
          include: [
            {
              model: database.Suppliers,
              as: "supplier",
              attributes: ["id", "name"],
            },
          ],
        },
      ],
    });

    if (!purchaseRequest) {
      throw new Error("Purchase request not found.");
    }

    /* RN: non-admin users can only access their own purchase requests */
    if (purchaseRequest.userId !== dto.userId && !user.isAdmin) {
      throw new Error(
        "You can only access purchase requests that you created or if you are an admin."
      );
    }

    return purchaseRequest;
  }

  async deleteById(dto) {
    const user = await database.Users.findByPk(dto.userId);

    if (!user) {
      throw new Error("User not found.");
    }

    const purchaseRequest = await database.PurchaseRequests.findOne({
      where: {
        id: dto.id,
      },
    });

    if (!purchaseRequest) {
      throw new Error("Purchase request not found.");
    }

    /* RN: only the user who created the purchase request or an admin can delete it */
    if (purchaseRequest.userId !== dto.userId && !user.isAdmin) {
      throw new Error(
        "You can only delete purchase requests that you created or if you are an admin."
      );
    }

    try {
      await database.PurchaseRequests.destroy({
        where: {
          id: dto.id,
        },
      });
    } catch (error) {
      console.error("Service error:", error.message);
      throw error;
    }
  }
}

module.exports = PurchaseRequestService;
