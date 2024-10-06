const { sign, verify } = require("jsonwebtoken");
const { compare, hash } = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");

const jsonSecret = require("../config/jsonSecret");
const MailService = require("./mail-service");
const database = require("../models");

const mailService = new MailService();
let { FRONTEND_URL } = process.env;

class AuthService {
  /* sign in, sign up, sign out */
  async signIn(dto) {
    const user = await database.Users.findOne({
      where: {
        email: { [Op.iLike]: dto.email },
      },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    const samePassword = await compare(dto.password, user.passwordHash);

    if (!samePassword) {
      throw new Error("Invalid password.");
    }

    if (!user.isActive) {
      throw new Error(
        "Your account has been disabled. Please contact support."
      );
    }

    const authToken = sign({ userId: user.id }, jsonSecret.secret, {
      expiresIn: 24 * 60 * 60, // 24 hours
    });

    return { user, authToken };
  }

  async signUp(dto) {
    const byEmail = await database.Users.findOne({
      where: {
        email: { [Op.iLike]: dto.email },
      },
    });

    if (byEmail) {
      throw new Error("There is already a user with this email.");
    }

    try {
      const newUser = await database.Users.create({
        id: uuidv4(),
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        passwordHash: await hash(dto.password, 10),
      });

      const authToken = sign({ userId: newUser.id }, jsonSecret.secret, {
        expiresIn: 24 * 60 * 60, // 24 hours
      });

      return { user: newUser, authToken };
    } catch (error) {
      console.error("Service error:", error.message);
      throw error;
    }
  }

  /* reset password */
  async forgotPassword(email) {
    const user = await database.Users.findOne({
      where: {
        email: { [Op.iLike]: email },
      },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    const secret = jsonSecret.secret + user.passwordHash;
    const payload = { id: user.id, email: user.email };
    const token = sign(payload, secret, { expiresIn: "15m" });
    const link = `${FRONTEND_URL}/reset-password/${user.id}/${token}`; // exactly the same as the route in the frontend

    try {
      const subject = "Password Reset Request";
      const text = `Access the following link to reset your password: ${link}`;

      await mailService.sendMail(user.email, subject, text);
    } catch (error) {
      console.error("Occured an error while sending the email:", error.message);
      throw error;
    }
  }

  async resetPassword(dto) {
    const user = await database.Users.findOne({
      where: {
        id: dto.id,
      },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    const secret = jsonSecret.secret + user.passwordHash;

    try {
      const payload = verify(dto.token, secret);

      if (!payload) {
        throw new Error("Invalid or expired token.");
      }

      user.passwordHash = await hash(dto.password, 10);

      await user.save();
    } catch (error) {
      console.error("Service error:", error.message);
      throw error;
    }
  }

  /* validate token */
  async validateUserToken(userId) {
    const user = await database.Users.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    if (!user.isActive) {
      throw new Error(
        "Your account has been disabled. Please contact support."
      );
    }

    return user;
  }

  async validateResetToken(dto) {
    const user = await database.Users.findOne({
      where: {
        id: dto.id,
      },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    const secret = jsonSecret.secret + user.passwordHash;

    try {
      const decoded = verify(dto.token, secret);

      if (!decoded) {
        throw new Error("Invalid or expired token.");
      }
    } catch (error) {
      console.error("Service error:", error.message);
      throw error;
    }
  }
}

module.exports = AuthService;
