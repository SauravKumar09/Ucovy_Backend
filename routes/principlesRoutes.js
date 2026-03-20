const express = require("express");
const router = express.Router();

const {
  getPrinciplesContent,
  upsertPrinciplesContent,
} = require("../controller/principlesController");

router.get("/", getPrinciplesContent);
router.post("/upsert", upsertPrinciplesContent);

module.exports = router;
