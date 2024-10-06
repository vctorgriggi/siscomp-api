const { verify } = require("jsonwebtoken");

const jsonSecret = require("../config/jsonSecret");
const database = require("../models");

const auth = async (req, res, next) => {
  const token = req.cookies["authToken"];

  if (!token) {
    return res.status(401).send({
      message: "You must be logged in to use this service.",
    });
  }

  try {
    const decoded = verify(token, jsonSecret.secret);

    if (!decoded.userId) {
      return res.status(403).send({
        message: "Invalid access token.",
      });
    }

    req.userId = decoded.userId;

    const user = await database.Users.findOne({
      where: {
        id: req.userId,
      },
    });

    if (!user.isActive) {
      return res.status(403).send({
        message: "Your account has been disabled. Please contact support.",
      });
    }

    return next();
  } catch (error) {
    console.error(error.stack);
    return res
      .status(403)
      .send({ message: "Invalid or expired access token." });
  }
};

module.exports = auth;
