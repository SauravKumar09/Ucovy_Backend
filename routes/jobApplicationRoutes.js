const express = require("express");
const JobApplication = require("../models/JobApplication");

const router = express.Router();

// Submit application
router.post("/", async (req, res) => {
  try {
    const {
      jobId = "",
      jobTitle = "",
      name = "",
      email = "",
      phone = "",
      yearsOfExperience = "",
      location = "",
      resumeUrl = "",
    } = req.body || {};

    if (!String(name).trim() || !String(email).trim()) {
      return res.status(400).json({ message: "name and email are required" });
    }

    const application = new JobApplication({
      jobId: String(jobId).trim(),
      jobTitle: String(jobTitle).trim(),
      name: String(name).trim(),
      email: String(email).trim(),
      phone: String(phone).trim(),
      yearsOfExperience: String(yearsOfExperience).trim(),
      location: String(location).trim(),
      resumeUrl: String(resumeUrl).trim(),
    });

    await application.save();
    res.status(201).json({ message: "Application submitted successfully", application });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit application", error: error.message });
  }
});

// Get all applications (Admin)
router.get("/", async (req, res) => {
  try {
    const data = await JobApplication.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch applications", error: error.message });
  }
});

module.exports = router;
