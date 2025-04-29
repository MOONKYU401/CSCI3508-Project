const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the process if the connection fails (optional)
  }
};

connectDB();

const PetSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  age: { type: Number, min: [0, 'Age must be a positive number'] },
  species: {
    type: String,
    enum: ['Dog', 'Cat', 'Rabbit', 'Bird', 'Other'],
    required: true,
  },
  breed: { type: String },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Unknown'],
    default: 'Unknown',
  },
  description: { type: String },
  imageUrl: { type: String },
  available: { type: Boolean, default: true },
  intakeDate: { type: Date, default: Date.now },
  shelter: {
    name: String,
    location: String,
    contactEmail: String
  }
});

module.exports = mongoose.model('Pet', PetSchema);
