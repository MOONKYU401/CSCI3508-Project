require("dotenv").config(); 
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const authRoutes = require("./auth");
const petRoutes = require("./pet");
const userRoutes = require("./user");
const authJwt = require("./auth_jwt");

dotenv.config();

const app = express(); 

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use("/auth", authRoutes);
app.use("/pets", petRoutes);
app.use("/user", authJwt.isAuthenticated, userRoutes); 

// MongoDB 
mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to MongoDB");
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
.catch(err => {
  console.error("Failed to connect to MongoDB:", err);
});
