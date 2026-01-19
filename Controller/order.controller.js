const Order = require('../db/order');
const Product = require('../db/product');
const User = require('../db/user');

async function createOrder(req, res) {
  try {
    if (!req.body.items || !Array.isArray(req.body.items)) {
      return res.status(400).json({ message: "items is required and must be array" });
    }

    const userId = req.user.id;
    const user = await User.findById(userId);
    if (user.isBlocked) {
      return res.status(403).json({ message: "User is blocked by admin" });
    }

    let itemsWithImages = [];
    let total = 0;

    for (let i of req.body.items) {
      const product = await Product.findById(i.productId);
      if (!product || !product.isActive) {
        return res.status(404).json({ message: "Product not available" });
      }

      if (i.priceAtAdd !== product.price) {
        return res.status(400).json({
          message: `Price changed for product: ${product.name}`,
          oldPrice: i.priceAtAdd,
          newPrice: product.price
        });
      }

      if (product.stock < i.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }

      product.stock -= i.quantity;
      product.soldCount += i.quantity;
      if (product.stock === 0) product.isActive = false;
      await product.save();

      itemsWithImages.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: i.quantity,
        image: product.image,
      });

      total += product.price * i.quantity;
    }

    const order = new Order({
      userId,
      items: itemsWithImages,
      total,
      address: req.body.address, 
      status: "pending"
    });

    await order.save();
    res.status(201).json(order);

  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: error.message });
  }
}


async function getAllOrders(req, res) {
  try {
    const orders = await Order.find().populate('userId', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getUserOrders(req, res) {
  try {
    let orders;
    if (req.user.role === 'admin') {
      orders = await Order.find().populate('userId', 'name email').sort({ createdAt: -1 });
    } else {
      orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    }
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getOrderById(req, res) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (req.user.role !== 'admin' && order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function markCashPaid(req, res) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.status !== 'pending') {
      return res.status(400).json({ message: `Cannot pay, status: ${order.status}` });
    }

    order.status = 'cash-paid';
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function markDelivered(req, res) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.status !== 'cash-paid') {
      return res.status(400).json({ message: 'Only paid orders can be delivered' });
    }

    order.status = 'delivered';
    order.deliveredAt = new Date();
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function cancelOrderByUser(req, res) {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (order.userId.toString() !== req.user.id) return res.status(403).json({ message: "Forbidden" });

  if (["shipped", "delivered", "cancelled_by_user", "cancelled_by_admin"].includes(order.status)) {
    return res.status(400).json({ message: "Cannot cancel this order now" });
  }

  order.status = 'cancelled_by_user';
  await order.save();
  res.json({ message: "Order cancelled successfully", order });
}

async function cancelOrderByAdmin(req, res) {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: 'cancelled_by_admin' },
    { new: true }
  );

  res.json(order);
}

async function requestRefund(req, res) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status !== 'delivered') {
      return res.status(400).json({ message: "Order not delivered yet" });
    }

    const days = (Date.now() - new Date(order.deliveredAt).getTime()) / (1000 * 60 * 60 * 24);
    if (days > 14) return res.status(400).json({ message: "Refund period expired" });

    for (let item of order.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.stock += item.quantity;
        product.soldCount -= item.quantity;
        if (product.stock > 0) product.isActive = true;
        await product.save();
      }
    }

    order.status = 'refund_requested';
    await order.save();
    res.json({ message: "Refund requested successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteOrder(req, res) {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getPendingOrders(req, res) {
  try {
    const orders = await Order.find({ status: "pending" }).populate("userId", "name email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
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
};
