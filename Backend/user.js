const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  FullName: String,
  Email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  phone: String,
  state: {
    type: String,
    enum: [
      'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
      'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
      'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
      'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
      'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
    ]
  },
  preferredBreed: {
    type: String,
    default: ""
  },
  preferredZip: {
    type: String,
    default: "",
    match: [/^\d{5}$/, 'Must be a valid 5-digit ZIP code']
  },
  preferredAnimalType: {
    type: String,
    enum: ["Dog", "Cat", "Other"],
    default: "Dog"
  },
  savedPets: [
    {
      animalId: String,
      Name: String,
      zipPostal: String,
      animalType: String
    }
  ]
});

module.exports = mongoose.model("User", UserSchema);
