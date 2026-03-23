const mongoose = require("mongoose");

const insightSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    image: { type: String, default: "", trim: true },
    tag: { type: String, default: "", trim: true },
    date: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Insight", insightSchema);
