const express = require("express");
const router = express.Router();

const statController = require("../controller/statController");

router.post("/add", statController.addStat);
router.get("/", statController.getStats);

module.exports = router;
