const express = require("express");

const userRoute = require("./user-route");
const authRoute = require("./auth-route");
const productCategoryRoute = require("./product-category-route");
const productRoute = require("./product-route");
const purchaseRequestRoute = require("./purchase-request-route");
const supplierRoute = require("./supplier-route");
const contactRoute = require("./contact-route");
const quotationRoute = require("./quotation-route");

const router = express.Router();

router
  .use("/user", userRoute)
  .use("/auth", authRoute)
  .use("/product-category", productCategoryRoute)
  .use("/product", productRoute)
  .use("/purchase-request", purchaseRequestRoute)
  .use("/supplier", supplierRoute)
  .use("/contact", contactRoute)
  .use("/quotation", quotationRoute);

module.exports = router;
