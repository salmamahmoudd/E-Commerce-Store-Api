const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products"
      },
      quantity: Number,
      priceAtAdd: Number
    }
  ]
}, { timestamps: true });


const Cart = mongoose.model("carts", cartSchema);
module.exports = Cart;