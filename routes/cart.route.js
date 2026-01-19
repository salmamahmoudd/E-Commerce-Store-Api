const express = require("express");
const router = express.Router();
const { protect } = require("../Middleware/auth");
const { getCart } = require("../Controller/cart.controller");

router.get("/", protect, getCart);

module.exports = router;
