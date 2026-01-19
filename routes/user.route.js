const express = require("express");
const router = express.Router();
const { protect ,admin } = require("../Middleware/auth");
const upload = require("../Middleware/upload.");
const { getProfile, updateProfile ,blockUser ,unblockUser,getAllUsers } = require("../Controller/user.controller");

router.get("/me", protect, getProfile);
router.put("/me", protect, upload.single("image"), updateProfile);
router.get("/", protect, admin, getAllUsers);
router.put("/:id/block", protect, admin, blockUser);
router.put("/:id/unblock", protect, admin, unblockUser);

module.exports = router;
