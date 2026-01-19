const Category = require("../db/category");

async function addCategory(req, res) {
  try {
    const { name, slug } = req.body;
    const image = req.file ? `http://localhost:3000/${req.file.path.replace("\\","/")}` : undefined;

    const slugValue = slug || name.toLowerCase().replace(/\s+/g, '-');
    const category = new Category({ name, slug: slugValue, image });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getCategories(req, res) {
  try {
    const categories = await Category.find({ isDeleted: false });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getCategory(req, res) {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateCategory(req, res) {
  try {
    const { name, slug } = req.body;
    const { id } = req.params;
    const image = req.file ? `http://localhost:3000/${req.file.path.replace("\\","/")}` : undefined;

    const category = await Category.findByIdAndUpdate(
      id,
      { name, slug: slug || name.toLowerCase().replace(/\s+/g, '-'), image },
      { new: true }
    );

    if (!category) return res.status(404).json({ message: "Category not found" });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteCategory(req, res) {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { addCategory, getCategories, getCategory, updateCategory, deleteCategory };
