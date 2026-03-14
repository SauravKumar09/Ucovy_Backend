const mongoose = require("mongoose");

const careerSchema = new mongoose.Schema({
  role: String,
  description: String,
  experience: String,
  location: String
});

module.exports = mongoose.model("Career", careerSchema);
