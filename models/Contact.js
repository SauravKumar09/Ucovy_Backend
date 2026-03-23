const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  phone: { type: String, default: "", trim: true },
  companyName: { type: String, default: "", trim: true },
  message: { type: String, default: "", trim: true },
}, { timestamps: true });

module.exports = mongoose.model("Contact", contactSchema);