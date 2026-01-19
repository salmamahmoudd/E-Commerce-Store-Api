const Product = require("../db/product");
const mongoose = require("mongoose");
const Testimonial = require("../db/testimonial");
const User = require("../db/user");

async function addTestimonial(req, res) {
  try {
    const { comment, rating } = req.body;
    const testimonial = new Testimonial({
      userId: req.user.id,
      comment,
      rating
    });
    await testimonial.save();
    res.status(201).json({ message: "Testimonial submitted for approval" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getApprovedTestimonials(req, res) {
  try {
    const testimonials = await Testimonial.find({ isApproved: true })
      .populate("userId", "name image");
    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getAllTestimonials(req, res) {
  try {
    const testimonials = await Testimonial.find()
      .populate("userId", "name image");
    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function approveTestimonial(req, res) {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true }
    );
    if (!testimonial) return res.status(404).json({ message: "Testimonial not found" });
    res.status(200).json({ message: "Testimonial approved", testimonial });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function rejectTestimonial(req, res) {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByIdAndDelete(id);
    if (!testimonial) return res.status(404).json({ message: "Testimonial not found" });
    res.status(200).json({ message: "Testimonial rejected and deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function pendingTestimonial (req, res) {
  const pending = await Testimonial.find({ isApproved: false }).populate("userId", "name image");
  res.status(200).json(pending);
}
module.exports = {
  addTestimonial,
  getApprovedTestimonials,
  getAllTestimonials,
  approveTestimonial,
  rejectTestimonial,
  pendingTestimonial
};