const express = require("express");
const router = express.Router();
const upload = require("../Middleware/upload.");
const { protect, admin } = require("../Middleware/auth");
const { addSubCategory, getSubCategories, getSubCategoriesByCategory, updateSubCategory, deleteSubCategory } = require("../Controller/subcategory.controller");

router.post("/", protect, admin, upload.single("image"), addSubCategory);
router.get("/", getSubCategories);
router.get("/category/:categoryId", getSubCategoriesByCategory);
router.put("/:id", protect, admin, upload.single("image"), updateSubCategory);
router.delete("/:id", protect, admin, deleteSubCategory);

module.exports = router;
