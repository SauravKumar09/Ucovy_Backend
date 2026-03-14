const express = require("express");
const router = express.Router();
const controller = require("../controller/contactController");

router.post("/", controller.submitContact);
router.get("/", controller.getContacts);

module.exports = router;
