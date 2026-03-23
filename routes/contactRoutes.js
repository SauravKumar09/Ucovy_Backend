const express = require("express");
const router = express.Router();
const controller = require("../controller/contactController");

router.post("/", controller.submitContact);
router.get("/", controller.getContacts);
router.put("/:id", controller.updateContact);
router.delete("/:id", controller.deleteContact);

module.exports = router;
