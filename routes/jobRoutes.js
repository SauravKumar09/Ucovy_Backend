const express = require("express");
const router = express.Router();
const controller = require("../controller/jobController");

router.post("/", controller.addJob);
router.get("/", controller.getJobs);
router.get("/:id", controller.getJobById);
router.delete("/:id", controller.deleteJob);

module.exports = router;
