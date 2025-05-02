const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("./user"); 

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";


router.post("/signup", async (req, res) => {
  try {
    const { Email, password, FullName, phone, state, preferredBreed, preferredZip } = req.body;

    const existingUser = await User.findOne({ Email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      Email,
      password: hashedPassword,
      FullName,
      phone,
      state,
      preferredBreed,
      preferredZip,
    });

    await newUser.save();

    const tokenPayload = { _id: newUser._id, Email: newUser.Email };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ token, user: tokenPayload });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { Email, password } = req.body;

    const user = await User.findOne({ Email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const tokenPayload = { _id: user._id, Email: user.Email };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, user: tokenPayload });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
