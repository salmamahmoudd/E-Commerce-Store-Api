const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  soldCount: {
  type: Number,
  default: 0
},
  image: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "categories",
    required: true
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subcategories"
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  ratingsAverage: {
    type: Number,
    min: 1,
    max: 5,
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
   reviews: [
    {
      user: String,
      comment: String,
      rating: Number,
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model("products", productSchema);
