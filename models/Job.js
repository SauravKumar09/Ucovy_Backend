const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  firstName: String,
  jobTitle: String,
  experience: String,
  workAuthorization: String,
  state: String,
  phone: String,
  email: String,
  resumeUrl: String, // Request Resume – link to view/download resume
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);
