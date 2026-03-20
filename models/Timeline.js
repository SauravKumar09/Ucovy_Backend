const mongoose = require("mongoose");

const timelineSchema = new mongoose.Schema(
  {
    year: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Timeline", timelineSchema);
