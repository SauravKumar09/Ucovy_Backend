const mongoose = require("mongoose");

const principleItemSchema = new mongoose.Schema(
  {
    heading: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const principlesContentSchema = new mongoose.Schema(
  {
    statementHeading: { type: String, default: "What We're Built On", trim: true },
    statementText: {
      type: String,
      default: "Great work is built on clarity, trust, and intent.",
      trim: true,
    },
    principles: { type: [principleItemSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PrinciplesContent", principlesContentSchema);
