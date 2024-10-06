const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");

const database = require("../models");

class SupplierService {
  async create(dto) {
    const byCnpj = await database.Suppliers.findOne({
      where: {
        cnpj: { [Op.iLike]: dto.cnpj },
      },
    });

    if (byCnpj) {
      throw new Error("There is already a supplier with this CNPJ.");
    }

    try {
      const newSupplier = await database.Suppliers.create({
        id: uuidv4(),
        name: dto.name,
        address: dto.address,
        phone: dto.phone,
        email: dto.email,
        cnpj: dto.cnpj,
      });

      return newSupplier;
    } catch (error) {
      console.error("Service error:", error.message);
      throw error;
    }
  }

  async get() {
    const suppliers = await database.Suppliers.findAll();

    return suppliers;
  }

  async getById(id) {
    const supplier = await database.Suppliers.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: database.Contacts,
          as: "contacts",
        },
        {
          model: database.Quotes,
          as: "quotes",
        },
      ],
    });

    if (!supplier) {
      throw new Error("Supplier not found.");
    }

    return supplier;
  }

  async updateById(dto) {
    const supplier = await database.Suppliers.findOne({
      where: {
        id: dto.id,
      },
    });

    if (!supplier) {
      throw new Error("Supplier not found.");
    }

    const byCnpj = await database.Suppliers.findOne({
      where: {
        cnpj: { [Op.iLike]: dto.cnpj },
        id: { [Op.ne]: dto.id },
      },
    });

    if (byCnpj) {
      throw new Error("There is already a supplier with this CNPJ.");
    }

    try {
      supplier.name = dto.name;
      supplier.address = dto.address;
      supplier.phone = dto.phone;
      supplier.email = dto.email;
      supplier.cnpj = dto.cnpj;

      await supplier.save();

      return await supplier.reload();
    } catch (error) {
      console.error("Service error:", error.message);
      throw error;
    }
  }

  async deleteById(id) {
    const supplier = await database.Suppliers.findOne({
      where: {
        id: id,
      },
    });

    if (!supplier) {
      throw new Error("Supplier not found.");
    }

    try {
      await database.Suppliers.destroy({
        where: {
          id: id,
        },
      });
    } catch (error) {
      console.error("Service error:", error.message);
      throw error;
    }
  }
}

module.exports = SupplierService;
