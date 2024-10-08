const { Router } = require("express");

const ProductCategoryController = require("../controllers/product-category-controller");
const isAdmin = require("../middlewares/admin");
const upload = require("../middlewares/upload");
const auth = require("../middlewares/auth");

const router = Router();

router
  .post(
    "/",
    auth,
    isAdmin,
    upload.single("file"),
    ProductCategoryController.create
  )
  .get("/", auth, ProductCategoryController.get)
  .get("/:id", auth, ProductCategoryController.getById)
  .put(
    "/:id",
    auth,
    isAdmin,
    upload.single("file"),
    ProductCategoryController.updateById
  )
  .delete("/:id", auth, isAdmin, ProductCategoryController.deleteById)
  .delete("/i/:id", auth, isAdmin, ProductCategoryController.deleteImage);

module.exports = router;
