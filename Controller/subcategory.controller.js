const SubCategory = require("../db/subcategory");


async function addSubCategory(req, res) {
  try {
    const { name, category } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        message: "name and category are required"
      });
    }

    const exists = await SubCategory.findOne({
      name: name.trim(),
      category
    });

    if (exists) {
      return res.status(400).json({
        message: "SubCategory already exists in this category"
      });
    }

    const image = req.file
      ? `http://localhost:3000/${req.file.path.replace("\\", "/")}`
      : undefined;

    const slug = name.toLowerCase().replace(/\s+/g, "-");

    const subCategory = new SubCategory({
      name,
      slug,
      category,
      image
    });

    await subCategory.save();
    res.status(201).json(subCategory);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}



async function getSubCategories(req, res){
    try{
        const subs = await SubCategory.find({ isDeleted: false }).populate("category", "_id name");
        res.status(200).json(subs);
    }catch (error){
        res.status(500).json({ message: error.message });
    }
}

async function getSubCategoriesByCategory(req, res) {
  try {
    const { categoryId } = req.params;

    const subs = await SubCategory.find({
      category: categoryId,
      isDeleted: false
    }).populate("category", "name");

    res.status(200).json(subs);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateSubCategory(req, res) {
  try {
    const { id } = req.params;
    const { name, category } = req.body;
    const image = req.file ? `http://localhost:3000/${req.file.path.replace("\\","/")}` : undefined;

    const updatedData = { name, category };
    if (image) updatedData.image = image;

    const sub = await SubCategory.findByIdAndUpdate(id, updatedData, { new: true });
    if (!sub) return res.status(404).json({ message: "Subcategory not found" });

    res.status(200).json(sub);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


async function deleteSubCategory(req, res) {
  try {
    const { id } = req.params;

    const sub = await SubCategory.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!sub) {
      return res.status(404).json({ message: "SubCategory not found" });
    }

    res.status(200).json({ message: "SubCategory deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


module.exports = {addSubCategory, getSubCategories, getSubCategoriesByCategory ,updateSubCategory ,deleteSubCategory}