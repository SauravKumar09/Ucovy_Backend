const express = require("express");
const Blog = require("../models/Blog");

const router = express.Router();

// Get all blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blogs", error: error.message });
  }
});

// Add blog (admin)
router.post("/", async (req, res) => {
  try {
    const { title, description, date = "", link = "" } = req.body || {};

    if (!String(title || "").trim() || !String(description || "").trim()) {
      return res.status(400).json({ message: "title and description are required" });
    }

    const newBlog = new Blog({
      title: String(title).trim(),
      description: String(description).trim(),
      date: String(date || "").trim(),
      link: String(link || "").trim(),
    });

    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(500).json({ message: "Failed to create blog", error: error.message });
  }
});

// Delete blog
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Blog.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Blog not found" });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete blog", error: error.message });
  }
});

module.exports = router;
