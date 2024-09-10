const { v4: uuidv4 } = require("uuid");
const { hash } = require("bcryptjs");
const { Op } = require("sequelize");
const crypto = require("crypto");

const MailService = require("./mail-service");
const database = require("../models");

const mailService = new MailService();

class UserService {
  async create(dto) {
    const userByEmail = await database.Users.findOne({
      where: {
        email: { [Op.iLike]: dto.email },
      },
    });

    if (userByEmail) {
      throw new Error("There is already a user with this email.");
    }

    try {
      const password = crypto.randomBytes(8).toString("hex");
      const hashedPassword = await hash(password, 10);

      const newUser = await database.Users.create({
        id: uuidv4(),
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        passwordHash: hashedPassword,
        isAdmin: dto.isAdmin, // boolean value, default is false
      });

      try {
        const subject = "Welcome to our platform!";
        const text = `Hello, ${newUser.firstName}! Your account has been created successfully. Before you can sign in, you need to set a password. Please click on 'Forgot Password' on the login page and follow the steps to create a new password.`;

        await mailService.sendMail(newUser.email, subject, text);
      } catch (error) {
        throw new Error("User created, but email could not be sent.");
      }

      return newUser;
    } catch (error) {
      console.error("Service error:", error.message);
      throw error;
    }
  }

  async get() {
    const users = await database.Users.findAll();

    return users;
  }

  async getById(id) {
    const user = await database.Users.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: database.PurchaseRequests,
          as: "purchaseRequests",
        },
      ],
    });

    if (!user) {
      throw new Error("User not found.");
    }

    return user;
  }

  async updateById(dto) {
    const user = await database.Users.findOne({
      where: {
        id: dto.id,
      },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    const userByEmail = await database.Users.findOne({
      where: {
        email: { [Op.iLike]: dto.email },
        id: { [Op.ne]: dto.id },
      },
    });

    if (userByEmail) {
      throw new Error("There is already a user with this email.");
    }

    try {
      /* RN: user can change their own details, but not their own status or role */
      if (
        dto.userId === dto.id &&
        (dto.isAdmin !== user.isAdmin || dto.isActive !== user.isActive)
      ) {
        throw new Error(
          "You are not allowed to change your own status or role. All changes have been discarded."
        );
      }

      user.firstName = dto.firstName;
      user.lastName = dto.lastName;
      user.email = dto.email;
      user.isAdmin = dto.isAdmin; // boolean value
      user.isActive = dto.isActive; // boolean value

      await user.save();

      return await user.reload();
    } catch (error) {
      console.error("Service error:", error.message);
      throw error;
    }
  }

  async deleteById(id) {
    const user = await database.Users.findOne({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    try {
      await database.Users.destroy({
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

module.exports = UserService;
