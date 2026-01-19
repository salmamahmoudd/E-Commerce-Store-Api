const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Category required"],
    unique: [true, "Category must be unique"],
    minlength: [3, "Too short category name"],
    maxlength: [32, "Too long category name"],
  },
  slug: { type: String, lowercase: true },
  image: String,
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

const Category = mongoose.model("categories", categorySchema);
module.exports = Category;
