const { Router } = require("express");

const ProductController = require("../controllers/product-controller");
const isAdmin = require("../middlewares/admin");
const upload = require("../middlewares/upload");
const auth = require("../middlewares/auth");

const router = Router();

router
  .post("/", auth, isAdmin, upload.single("file"), ProductController.create)
  .get("/", auth, ProductController.get)
  .get("/:id", auth, ProductController.getById)
  .put(
    "/:id",
    auth,
    isAdmin,
    upload.single("file"),
    ProductController.updateById
  )
  .delete("/:id", auth, isAdmin, ProductController.deleteById)
  .delete("/i/:id", auth, isAdmin, ProductController.deleteImage);

module.exports = router;
