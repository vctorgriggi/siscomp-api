const ContactService = require("../services/contact-service");

const contactService = new ContactService();

class ContactController {
  static async create(req, res) {
    const { name, phone, email, role, supplierId } = req.body;

    try {
      await contactService.create({
        name,
        phone,
        email,
        role,
        supplierId,
      });

      return res.status(201).send();
    } catch (error) {
      console.error("Controller error:", error.message);
      return res.status(400).send({ message: error.message });
    }
  }

  static async get(req, res) {
    try {
      const suppliers = await contactService.get();

      return res.status(200).json(suppliers);
    } catch (error) {
      console.error("Controller error:", error.message);
      return res.status(400).send({ message: error.message });
    }
  }

  static async getById(req, res) {
    const { id } = req.params;

    try {
      const supplier = await contactService.getById(id);

      return res.status(200).json(supplier);
    } catch (error) {
      console.error("Controller error:", error.message);
      return res.status(400).send({ message: error.message });
    }
  }

  static async updateById(req, res) {
    const { id } = req.params;
    const { name, phone, email, role, supplierId } = req.body;

    try {
      const contact = await contactService.updateById({
        id,
        name,
        phone,
        email,
        role,
        supplierId,
      });

      return res.status(200).json(contact);
    } catch (error) {
      console.error("Controller error:", error.message);
      return res.status(400).send({ message: error.message });
    }
  }

  static async deleteById(req, res) {
    const { id } = req.params;

    try {
      await contactService.deleteById(id);

      return res.status(204).send();
    } catch (error) {
      console.error("Controller error:", error.message);
      return res.status(400).send({ message: error.message });
    }
  }
}

module.exports = ContactController;
