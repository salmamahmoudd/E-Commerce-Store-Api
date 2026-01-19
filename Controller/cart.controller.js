const Cart = require("../db/cart");
const Product = require("../db/product");

async function getCart(req, res) {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate("items.productId", "name price image isActive");

    if (!cart) return res.status(200).json({ items: [] });

    let priceChanged = false;

    const items = cart.items.map(item => {
      const product = item.productId;
      if (!product.isActive) return item; 
      if (item.priceAtAdd !== product.price) priceChanged = true;
      return {
        ...item._doc,
        currentPrice: product.price,
        name: product.name,
        image: product.image,
        stock: product.stock
      };
    });

    res.status(200).json({ items, priceChanged });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { getCart };
