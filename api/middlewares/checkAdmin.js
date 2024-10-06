const database = require("../models");

const isAdmin = async (req, res, next) => {
  try {
    const user = await database.Users.findOne({
      where: {
        id: req.userId,
      },
    });

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    if (user.isAdmin) {
      return next();
    } else {
      return res
        .status(403)
        .send({ message: "Authentication refused! Unauthorized action." });
    }
  } catch (error) {
    console.error("Error occurred while checking admin rights:", error.stack);
    return res.status(500).send({
      message:
        "Unable to verify admin status due to a server error. Please try again or contact support.",
    });
  }
};

module.exports = isAdmin;
