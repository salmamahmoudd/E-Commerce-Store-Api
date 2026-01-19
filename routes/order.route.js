const express = require("express");
const router = express.Router();
const { protect, admin } = require("../Middleware/auth");
const {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  markCashPaid,
  markDelivered,
  cancelOrderByUser,
  cancelOrderByAdmin,
  requestRefund,
  deleteOrder,
  getPendingOrders
} = require("../Controller/order.controller");

router.post("/", protect, createOrder);

router.get("/", protect, getUserOrders);
router.get("/:id", protect, getOrderById);

router.put("/:id/pay-cash", protect, markCashPaid);
router.put("/:id/deliver", protect, admin, markDelivered);

router.put("/:id/cancel-user", protect, cancelOrderByUser);
router.put("/:id/cancel-admin", protect, admin, cancelOrderByAdmin);

router.put("/:id/request-refund", protect, requestRefund);

router.get("/pending", protect, admin, getPendingOrders);

router.delete("/:id", protect, admin, deleteOrder);

module.exports = router;
