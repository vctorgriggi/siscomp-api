const { v4: uuidv4 } = require("uuid");

const database = require("../models");

class QuotationService {
  async create(dto) {
    if (!dto.purchaseRequestId) {
      throw new Error(
        "A quotation cannot be created without a purchase request."
      );
    }

    if (dto.supplierId) {
      const supplier = await database.Suppliers.findByPk(dto.supplierId);

      if (!supplier) {
        throw new Error("Supplier not found.");
      }
    }

    const purchaseRequest = await database.PurchaseRequests.findByPk(
      dto.purchaseRequestId,
      {
        include: [
          {
            model: database.Quotes,
            as: "quotes",
          },
        ],
      }
    );

    if (!purchaseRequest) {
      throw new Error("Purchase request not found.");
    }

    /* RN: if the purchase request has already been quoted, no more quotations can be added */
    if (purchaseRequest.status === "quoted") {
      throw new Error(
        "No more quotations can be added to this purchase request as it has already been quoted."
      );
    }

    try {
      const newQuotation = await database.Quotes.create({
        id: uuidv4(),
        supplierId: dto.supplierId,
        price: dto.price,
        observation: dto.observation,
        purchaseRequestId: dto.purchaseRequestId,
      });

      /* RN: count the number of quotations remaining for the purchase request */
      const quotationCount = await purchaseRequest.countQuotes();

      /* RN: logic to update the purchase request status based on the number of quotations */
      if (quotationCount < 3) {
        await purchaseRequest.update({ status: "in_quote" });
      } else if (quotationCount === 3) {
        await purchaseRequest.update({ status: "quoted" });
      }

      return newQuotation;
    } catch (error) {
      console.error("Service error:", error.message);
      throw error;
    }
  }

  async get() {
    const quotes = await database.Quotes.findAll({
      include: [
        {
          model: database.Suppliers,
          as: "supplier",
        },
        {
          model: database.PurchaseRequests,
          as: "purchaseRequest",
        },
      ],
    });

    return quotes;
  }

  async getById(id) {
    const quotation = await database.Quotes.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: database.Suppliers,
          as: "supplier",
        },
        {
          model: database.PurchaseRequests,
          as: "purchaseRequest",
        },
      ],
    });

    if (!quotation) {
      throw new Error("Quotation not found.");
    }

    return quotation;
  }

  async deleteById(id) {
    const quotation = await database.Quotes.findOne({
      where: {
        id: id,
      },
    });

    if (!quotation) {
      throw new Error("Quotation not found.");
    }

    const purchaseRequest = await database.PurchaseRequests.findByPk(
      quotation.purchaseRequestId,
      {
        include: [
          {
            model: database.Quotes,
            as: "quotes",
          },
        ],
      }
    );

    if (!purchaseRequest) {
      throw new Error("Purchase request not found.");
    }

    try {
      await database.Quotes.destroy({
        where: {
          id: id,
        },
      });

      /* RN: count the number of quotations remaining for the purchase request */
      const quotationCount = await purchaseRequest.countQuotes();

      /* RN: logic to update the purchase request status based on the number of quotations */
      if (quotationCount === 0) {
        await purchaseRequest.update({ status: "open" });
      } else if (quotationCount < 3) {
        await purchaseRequest.update({ status: "in_quote" });
      }
    } catch (error) {
      console.error("Service error:", error.message);
      throw error;
    }
  }
}

module.exports = QuotationService;
