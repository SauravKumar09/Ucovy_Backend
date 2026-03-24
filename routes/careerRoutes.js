
const express = require("express");
const router = express.Router();
const controller = require("../controller/careerController");

router.post("/", controller.addCareer);
router.get("/", controller.getCareers);
router.delete("/:id", controller.deleteCareer);

module.exports = router;