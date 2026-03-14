const mongoose = require("mongoose");

const vendorRequestSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  accessCode: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model("VendorRequest", vendorRequestSchema);
