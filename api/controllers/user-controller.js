const UserService = require("../services/user-service");

const userService = new UserService();

class UserController {
  static async create(req, res) {
    const { firstName, lastName, email, isAdmin } = req.body;

    try {
      await userService.create({
        firstName,
        lastName,
        email,
        isAdmin, // boolean value, default is fale
      });

      return res.status(201).send();
    } catch (error) {
      console.error("Controller error:", error.message);
      return res.status(400).send({ message: error.message });
    }
  }

  static async get(req, res) {
    try {
      const users = await userService.get();

      return res.status(200).json(users);
    } catch (error) {
      console.error("Controller error:", error.message);
      return res.status(400).send({ message: error.message });
    }
  }

  static async getById(req, res) {
    const { id } = req.params;

    try {
      const user = await userService.getById(id);

      return res.status(200).json(user);
    } catch (error) {
      console.error("Controller error:", error.message);
      return res.status(400).send({ message: error.message });
    }
  }

  static async updateById(req, res) {
    const { userId } = req;
    const { id } = req.params;
    const { firstName, lastName, email, isAdmin, isActive } = req.body;

    try {
      const user = await userService.updateById({
        userId,
        id,
        firstName,
        lastName,
        email,
        isAdmin,
        isActive,
      });

      return res.status(200).json(user);
    } catch (error) {
      console.error("Controller error:", error.message);
      return res.status(400).send({ message: error.message });
    }
  }

  static async deleteById(req, res) {
    const { id } = req.params;

    try {
      await userService.deleteById(id);

      return res.status(204).send();
    } catch (error) {
      console.error("Controller error:", error.message);
      return res.status(400).send({ message: error.message });
    }
  }
}

module.exports = UserController;
