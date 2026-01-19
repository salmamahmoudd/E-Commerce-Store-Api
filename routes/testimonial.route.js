const express = require("express");
const router = express.Router();
const { protect, admin } = require("../Middleware/auth");
const {
  addTestimonial,
  getApprovedTestimonials,
  approveTestimonial,
  getAllTestimonials,
  rejectTestimonial,
  pendingTestimonial
} = require("../Controller/testimonial.controller");

router.post("/", protect, addTestimonial);

router.get("/approved", getApprovedTestimonials);

router.get("/", protect, admin, getAllTestimonials);

router.put("/:id/approve", protect, admin, approveTestimonial);

router.delete("/:id", protect, admin, rejectTestimonial);

router.get("/pending", protect, admin, pendingTestimonial);

module.exports = router;
