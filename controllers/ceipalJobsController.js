const ceipalService = require("../services/ceipalService");

exports.getJobs = async (req, res) => {
  try {
    const data = await ceipalService.getJobs(req);
    res.json(data);
  } catch (error) {
    const status = error?.status || 500;
    res.status(status).json({ message: error?.message || "Failed to fetch Ceipal jobs" });
  }
};

// Backward-compatible alias used by your UI
exports.getRecentOpenings = exports.getJobs;

