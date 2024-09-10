const { Router } = require("express");

const PurchaseRequestController = require("../controllers/purchase-request-controller");
const auth = require("../middlewares/auth");

const router = Router();

router
  .post("/", auth, PurchaseRequestController.create)
  .get("/", auth, PurchaseRequestController.get)
  .get("/:id", auth, PurchaseRequestController.getById)
  .delete("/:id", auth, PurchaseRequestController.deleteById);

module.exports = router;
