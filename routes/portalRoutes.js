const express = require("express");
const router = express.Router();
const controller = require("../controller/portalController");

router.post("/request-resume", controller.requestResume);
router.get("/resume-requests", controller.getResumeRequests);

module.exports = router;
