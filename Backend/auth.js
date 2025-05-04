require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const User = require("./user");
const { isAuthenticated } = require("./auth_jwt");

const JWT_SECRET = process.env.JWT_SECRET;

// ----------------- Signup -----------------
router.post("/signup", async (req, res) => {
  try {
    const {
      Email,
      password,
      FullName,
      phone,
      state,
      preferredZip
    } = req.body;

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
      preferredZip
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

  

// ----------------- Login -----------------
router.post("/login", async (req, res) => {
  try {
    const emailInput = req.body.Email || req.body.email;
    const { password } = req.body;

    if (!emailInput || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ Email: emailInput }).select("+password");
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

// ----------------- Profile -----------------
router.get("/user/profile", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------- Save Pet -----------------
router.post("/user/save-pet", isAuthenticated, async (req, res) => {
  try {
    const { animalId, Name, zipPostal, animalType } = req.body;

    if (!animalId || !Name) {
      return res.status(400).json({ message: "Pet ID and name are required" });
    }

    const user = await User.findById(req.user._id);

    const alreadySaved = user.savedPets.some(p => p.animalId === animalId);
    if (alreadySaved) {
      return res.status(400).json({ message: "Pet is already saved" });
    }

    user.savedPets.push({ animalId, Name, zipPostal, animalType });
    await user.save();
    res.json({ message: "Pet saved successfully!" });
  } catch (err) {
    console.error("Save pet error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------- Remove Pet -----------------
router.delete("/user/saved-pet/:animalId", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const animalId = req.params.animalId;

    const beforeCount = user.savedPets.length;
    user.savedPets = user.savedPets.filter(p => p.animalId !== animalId);

    if (user.savedPets.length === beforeCount) {
      return res.status(404).json({ message: "Pet not found in saved list" });
    }

    await user.save();
    res.json({ message: "Pet removed from saved list" });
  } catch (err) {
    console.error("Remove saved pet error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------- Fetch Saved Pets -----------------
router.get("/user/saved-pets", isAuthenticated, async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select("savedPets");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const results = await Promise.all(
        user.savedPets.map(async ({ animalId, Name, zipPostal, animalType }) => {
          if (!zipPostal || !animalType) {
            return {
              animalId,
              Name,
              status: `Cannot search for ${Name || "this pet"} — missing zip code or animalType.`
            };
          }
  
          try {
            const response = await axios.post("https://api.petplace.com/animal", {
              locationInformation: {
                clientId: null,
                zipPostal: zipPostal,
                milesRadius: "10"
              },
              animalFilters: {
                startIndex: 0,
                filterAnimalType: animalType,
                filterBreed: [],
                filterGender: "",
                filterAge: null,
                filterSize: null
              }
            });
  
            const pet = response.data.animal?.find(a => a.animalId === animalId);
  
            if (pet) return pet;
  
            return {
              animalId,
              Name,
              status: `${Name || "This pet"} has found a new home.`
            };
          } catch (err) {
            console.error("Error fetching pet:", animalId);
            return {
              animalId,
              Name,
              status: `Could not fetch details for ${Name || "this pet"}.`
            };
          }
        })
      );
  
      res.json(results);
    } catch (err) {
      console.error("Saved pets fetch error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });
  

module.exports = router;
