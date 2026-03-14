const mongoose = require("mongoose");

const statSchema = new mongoose.Schema({
  number: String,
  mainText: String,
  subText: String
}, { timestamps: true });

module.exports = mongoose.model("Stat", statSchema);
