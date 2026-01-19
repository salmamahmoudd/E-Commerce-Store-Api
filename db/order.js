const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name: String,
  price: Number,
  quantity: Number,
  image: String,
});

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [orderItemSchema],
    total: Number,
    address: { type: String, required: true }, 
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "cash-paid",
        "shipped",
        "delivered",
        "cancelled_by_user",
        "cancelled_by_admin",
        "refund_requested",
        "refunded",
      ],
      default: "pending",
    },
    deliveredAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
