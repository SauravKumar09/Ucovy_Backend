const express = require("express");
const Insight = require("../models/Insight");

const router = express.Router();

// Get all insights
router.get("/", async (req, res) => {
  try {
    const insights = await Insight.find().sort({ createdAt: -1 });
    res.json(insights);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch insights", error: error.message });
  }
});

// Add insight (admin)
router.post("/", async (req, res) => {
  try {
    const { title, description, image = "", tag = "", date = "" } = req.body || {};

    if (!String(title || "").trim() || !String(description || "").trim()) {
      return res.status(400).json({ message: "title and description are required" });
    }

    const newInsight = new Insight({
      title: String(title).trim(),
      description: String(description).trim(),
      image: String(image || "").trim(),
      tag: String(tag || "").trim(),
      date: String(date || "").trim(),
    });

    await newInsight.save();
    res.status(201).json(newInsight);
  } catch (error) {
    res.status(500).json({ message: "Failed to create insight", error: error.message });
  }
});

// Delete insight
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Insight.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Insight not found" });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete insight", error: error.message });
  }
});

module.exports = router;
