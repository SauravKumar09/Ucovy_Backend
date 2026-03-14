const mongoose = require("mongoose");

const heroSchema = new mongoose.Schema({
  heading: String,
  subheading: String,
  description: String
}, { timestamps: true });

module.exports = mongoose.model("Hero", heroSchema);
