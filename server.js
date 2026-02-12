require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 3000; 

const userRoutes = require("./routes/user.route");
const authRoutes = require("./routes/auth.route");
const categoryRoutes = require("./routes/category.route");
const subCategoryRoutes = require("./routes/subcategory.route");
const productRoutes = require("./routes/product.route");
const orderRoutes = require("./routes/order.route");
const testimonialsRoutes = require("./routes/testimonial.route");

app.use(express.json());
app.use(cors({ origin: 'http://localhost:4200' }));
app.use('/uploads', express.static('uploads'));

app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/categories", categoryRoutes);
app.use("/subcategories", subCategoryRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/testimonials", testimonialsRoutes);

app.get("/", (req, res) => {
  res.send("Server running");
});


console.log(process.env.MONGO_URI);


async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI,{serverSelectionTimeoutMS:1000});
    console.log("MongoDB connected");
  } catch (err) {
    console.log(err);
  }
}
connectDb();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
