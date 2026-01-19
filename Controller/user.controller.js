const User = require("../db/user");

const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
}

const updateProfile = async (req, res) => {
  const { name, phone, address } = req.body;
  const data = { name, phone };

  if (address) {
    data.address = typeof address === 'string' ? JSON.parse(address) : address;
  }

  if (req.file) {
    data.image = req.file.filename;
  }

  const user = await User.findByIdAndUpdate(req.user.id, data, { new: true }).select("-password");

  res.json({ message: "Profile updated successfully", user });
}

async function blockUser(req, res) {
  const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: true }, { new: true });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User blocked successfully", user });
}

async function unblockUser(req, res) {
  const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: false }, { new: true });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User unblocked successfully", user });
}

async function getAllUsers(req, res) {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
}

module.exports = { getProfile, updateProfile, blockUser, unblockUser, getAllUsers };
