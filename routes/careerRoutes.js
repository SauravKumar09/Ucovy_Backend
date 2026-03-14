
const express = require("express");
const router = express.Router();
const controller = require("../controller/careerController");

router.post("/", controller.addCareer);
router.get("/", controller.getCareers);

module.exports = router;