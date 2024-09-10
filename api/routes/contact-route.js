const { Router } = require("express");

const ContactController = require("../controllers/contact-controller");
const isAdmin = require("../middlewares/checkAdmin");
const auth = require("../middlewares/auth");

const router = Router();

router
  .post("/", auth, isAdmin, ContactController.create)
  .get("/", auth, ContactController.get)
  .get("/:id", auth, ContactController.getById)
  .put("/:id", auth, isAdmin, ContactController.updateById)
  .delete("/:id", auth, isAdmin, ContactController.deleteById);

module.exports = router;
