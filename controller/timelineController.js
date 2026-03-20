const Timeline = require("../models/Timeline");

exports.addTimelineItem = async (req, res) => {
  try {
    const { year, description, order } = req.body;

    if (!year || !description) {
      return res.status(400).json({ message: "year and description are required." });
    }

    const item = new Timeline({
      year,
      description,
      order: Number.isFinite(Number(order)) ? Number(order) : 0,
    });

    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTimelineItems = async (req, res) => {
  try {
    const items = await Timeline.find().sort({ order: 1, createdAt: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTimelineItem = async (req, res) => {
  try {
    const { year, description, order } = req.body;
    const update = {};

    if (typeof year !== "undefined") update.year = year;
    if (typeof description !== "undefined") update.description = description;
    if (typeof order !== "undefined") {
      update.order = Number.isFinite(Number(order)) ? Number(order) : 0;
    }

    const item = await Timeline.findByIdAndUpdate(req.params.id, update, { new: true });

    if (!item) return res.status(404).json({ message: "Timeline item not found." });

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTimelineItem = async (req, res) => {
  try {
    const item = await Timeline.findByIdAndDelete(req.params.id);

    if (!item) return res.status(404).json({ message: "Timeline item not found." });

    res.json({ message: "Timeline item deleted." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
