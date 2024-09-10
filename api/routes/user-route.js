const { Router } = require("express");

const UserController = require("../controllers/user-controller");
const isAdmin = require("../middlewares/checkAdmin");
const auth = require("../middlewares/auth");

const router = Router();

router
  .post("/", auth, isAdmin, UserController.create)
  .get("/", auth, isAdmin, UserController.get)
  .get("/:id", auth, isAdmin, UserController.getById)
  .put("/:id", auth, isAdmin, UserController.updateById)
  .delete("/:id", auth, isAdmin, UserController.deleteById);

module.exports = router;
