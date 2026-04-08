const router = require("express").Router();
const controller = require("../controllers/product.controller");

router.post("/", controller.createProduct);
router.get("/", controller.getProducts);
router.get("/:id", controller.getProductById);
router.put("/:id", controller.updateProduct);
router.patch("/soft-delete/:id", controller.softDelete);
// router.patch("/restore/:id", controller.restore);
// router.delete("/hard-delete/:id", controller.hardDelete);

module.exports = router;