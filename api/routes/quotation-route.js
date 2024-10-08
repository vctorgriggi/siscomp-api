const { Router } = require("express");

const QuotationController = require("../controllers/quotation-controller");
const isAdmin = require("../middlewares/admin");
const auth = require("../middlewares/auth");

const router = Router();

router
  .post("/", auth, isAdmin, QuotationController.create)
  .get("/", auth, QuotationController.get)
  .get("/:id", auth, QuotationController.getById)
  .delete("/:id", auth, isAdmin, QuotationController.deleteById);

module.exports = router;
