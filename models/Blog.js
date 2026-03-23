const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    date: { type: String, default: "", trim: true },
    link: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
