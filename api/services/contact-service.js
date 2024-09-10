const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");

const database = require("../models");

class ContactService {
  async create(dto) {
    if (dto.supplierId) {
      const supplier = await database.Suppliers.findByPk(dto.supplierId);

      if (!supplier) {
        throw new Error("Supplier not found.");
      }
    }

    const contactByEmail = await database.Contacts.findOne({
      where: {
        email: { [Op.iLike]: dto.email },
      },
    });

    if (contactByEmail) {
      throw new Error("There is already a contact with this email address.");
    }

    try {
      const newContact = await database.Contacts.create({
        id: uuidv4(),
        name: dto.name,
        phone: dto.phone,
        email: dto.email,
        role: dto.role,
        supplierId: dto.supplierId,
      });

      return newContact;
    } catch (error) {
      console.error("Service error:", error.message);
      throw error;
    }
  }

  async get() {
    const contacts = await database.Contacts.findAll({
      include: [
        {
          model: database.Suppliers,
          as: "supplier",
        },
      ],
    });

    return contacts;
  }

  async getById(id) {
    const contact = await database.Contact.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: database.Suppliers,
          as: "supplier",
        },
      ],
    });

    if (!contact) {
      throw new Error("Contact not found.");
    }

    return contact;
  }

  async updateById(dto) {
    const contact = await database.Contacts.findOne({
      where: {
        id: dto.id,
      },
    });

    if (!contact) {
      throw new Error("Contact not found.");
    }

    if (dto.supplierId) {
      const supplier = await database.Suppliers.findByPk(dto.supplierId);

      if (!supplier) {
        throw new Error("Supplier not found.");
      }
    }

    const contactByEmail = await database.Contacts.findOne({
      where: {
        email: { [Op.iLike]: dto.email },
        id: { [Op.ne]: dto.id },
      },
    });

    if (contactByEmail) {
      throw new Error("There is already a contact with this email address.");
    }

    try {
      contact.name = dto.name;
      contact.phone = dto.phone;
      contact.email = dto.email;
      contact.role = dto.role;
      contact.supplierId = dto.supplierId;

      await contact.save();

      return await contact.reload();
    } catch (error) {
      console.error("Service error:", error.message);
      throw error;
    }
  }

  async deleteById(id) {
    const contact = await database.Contacts.findOne({
      where: {
        id: id,
      },
    });

    if (!contact) {
      throw new Error("Contact not found.");
    }

    try {
      await database.Contacts.destroy({
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

module.exports = ContactService;
