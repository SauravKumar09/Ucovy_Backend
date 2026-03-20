const express = require("express");
const router = express.Router();

const statController = require("../controller/statController");

router.post("/add", statController.addStat);
router.get("/", statController.getStats);
router.put("/:id", statController.updateStat);
router.delete("/:id", statController.deleteStat);

module.exports = router;
