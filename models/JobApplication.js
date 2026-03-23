const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema(
  {
    jobId: { type: String, default: "", trim: true },
    jobTitle: { type: String, default: "", trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, default: "", trim: true },
    yearsOfExperience: { type: String, default: "", trim: true },
    location: { type: String, default: "", trim: true },
    resumeUrl: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobApplication", jobApplicationSchema);
