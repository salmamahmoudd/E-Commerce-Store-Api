const express = require("express");
const router = express.Router();
const upload = require("../Middleware/upload.");
const { protect, admin } = require("../Middleware/auth");
const { addCategory, getCategories, getCategory, updateCategory, deleteCategory } = require("../Controller/category.controller");

router.post("/", protect, admin, upload.single("image"), addCategory);
router.get("/", getCategories);
router.get("/:id", getCategory);
router.put("/:id", protect, admin, upload.single("image"), updateCategory);
router.delete("/:id", protect, admin, deleteCategory);

module.exports = router;
