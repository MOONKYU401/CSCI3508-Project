const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('./user'); // models/User.js
const authJwt = require('./auth_jwt');


router.get("/user/profile", authJwt.isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/user/saved-pets", authJwt.isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("savedPets");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.savedPets || []);
  } catch (err) {
    console.error("Error fetching saved pets:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.use(router);
