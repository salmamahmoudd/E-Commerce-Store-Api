const express = require("express");
const router = express.Router();
const upload = require("../Middleware/upload.");
const { protect, admin } = require("../Middleware/auth");
const { addProduct, getProducts, getProduct, updateProduct, getFeaturedProducts ,deleteProduct, addReview } = require("../Controller/product.controller");

router.post("/", protect, admin, upload.single("image"), addProduct);
router.put("/:id", protect, admin, upload.single("image"), updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

router.get("/featured",  getFeaturedProducts);
router.get("/", getProducts);
router.get("/:id", getProduct);

router.post("/:id/reviews", protect, addReview);

module.exports = router;
