const express = require("express");
const ceipalController = require("../controller/ceipalController");

const router = express.Router();

// Ceipal "recent openings" (raw pass-through)
router.get("/recent-openings", ceipalController.getRecentOpenings);

module.exports = router;

