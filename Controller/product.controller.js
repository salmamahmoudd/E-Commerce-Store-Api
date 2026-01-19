const Product = require("../db/product");
const mongoose = require("mongoose");


async function addProduct(req,res){
    try{
        const { name, description, price, category, subcategory, stock , ratingsAverage} = req.body;
         const image = req.file
      ? `http://localhost:3000/uploads/${req.file.filename}`
      : null;

        if(!name || !description || !price || !category || !image){
            return res.status(400).json({ message: "All required fields must be provided" });
        }
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    const product = new Product({
         name, slug, description, price, image, category, subcategory, stock , ratingsAverage:ratingsAverage || 1
    });

    await product.save();
    res.status(201).json(product);
    }catch (error){
        res.status(500).json({message:error.message});
    }
}

async function getProducts(req, res){
    try{
        const products = await Product.find({isDeleted:false})
        .populate("category", "name")
        .populate("subcategory", "name");
        res.status(200).json(products);
    }catch (error){
        res.status(500).json({message:error.message});
    }
}

async function getProduct(req, res){
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const product = await Product.findById(id)
      .populate("category", "name")
      .populate("subcategory", "name");

    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateProduct(req, res) {
  try {
    const { name, description, price, category, subcategory, stock, ratingsAverage } = req.body;
    const { id } = req.params;

    const priceNum = Number(price);
    const stockNum = Number(stock);

    const image = req.file ? `http://localhost:3000/${req.file.path.replace("\\", "/")}` : undefined;

    const updateData = {
      name,
      slug: name?.toLowerCase().replace(/\s+/g, "-"),
      description,
      price: priceNum,
      category,
      subcategory,
      stock: stockNum,
      ...(ratingsAverage !== undefined && { ratingsAverage }),
      ...(image && { image })
    };

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);

  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: error.message, stack: error.stack });
  }
}

async function addReview(req, res) {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  product.reviews.push(req.body);
  await product.save();

  res.json(product);
};

async function getFeaturedProducts(req, res) {
  try {
    const products = await Product.find({ isActive: true, isDeleted: false })
      .sort({ soldCount: -1 }) 
      .limit(8) 
      .populate("category", "name")
      .populate("subcategory", "name");

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports ={addProduct,getProducts,getProduct,updateProduct,addReview,getFeaturedProducts,deleteProduct}