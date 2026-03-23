const express = require("express");
const InsightList = require("../models/InsightList");

const router = express.Router();

// Get all insight list items
router.get("/", async (req, res) => {
  try {
    const data = await InsightList.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch insight list", error: error.message });
  }
});

// Add insight list item (admin)
router.post("/", async (req, res) => {
  try {
    const { title, description, date = "", link = "" } = req.body || {};

    if (!String(title || "").trim() || !String(description || "").trim()) {
      return res.status(400).json({ message: "title and description are required" });
    }

    const newItem = new InsightList({
      title: String(title).trim(),
      description: String(description).trim(),
      date: String(date || "").trim(),
      link: String(link || "").trim(),
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: "Failed to create insight list item", error: error.message });
  }
});

// Delete insight list item
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await InsightList.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete insight list item", error: error.message });
  }
});

module.exports = router;
