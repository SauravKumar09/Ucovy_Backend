const express = require("express");
const router = express.Router();

const ceipalController = require("../controller/ceipalController");

// Proxies CEIPAL jobs (recent openings) to the frontend/admin.
// Optional: GET /api/ceipal/recent-openings?limit=10
router.get("/recent-openings", ceipalController.getRecentOpenings);

module.exports = router;

