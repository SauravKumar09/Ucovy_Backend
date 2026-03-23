const express = require("express");
const ceipalController = require("../controllers/ceipalJobsController");

const router = express.Router();

// Ceipal jobs (mapped fields)
router.get("/jobs", ceipalController.getJobs);

// Backward-compatible alias used by your UI
router.get("/recent-openings", ceipalController.getRecentOpenings);

module.exports = router;

