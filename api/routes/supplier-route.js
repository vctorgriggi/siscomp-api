const { Router } = require("express");

const SupplierController = require("../controllers/supplier-controller");
const isAdmin = require("../middlewares/admin");
const auth = require("../middlewares/auth");

const router = Router();

router
  .post("/", auth, isAdmin, SupplierController.create)
  .get("/", auth, SupplierController.get)
  .get("/:id", auth, SupplierController.getById)
  .put("/:id", auth, isAdmin, SupplierController.updateById)
  .delete("/:id", auth, isAdmin, SupplierController.deleteById);

module.exports = router;
