const express = require("express");
const router = express.Router();

const heroController = require("../controller/heroController");

router.post("/add", heroController.addHero);
router.get("/", heroController.getHero);

module.exports = router;
