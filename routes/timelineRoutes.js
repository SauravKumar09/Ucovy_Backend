const express = require("express");
const router = express.Router();

const timelineController = require("../controller/timelineController");

router.post("/add", timelineController.addTimelineItem);
router.get("/", timelineController.getTimelineItems);
router.put("/:id", timelineController.updateTimelineItem);
router.delete("/:id", timelineController.deleteTimelineItem);

module.exports = router;
