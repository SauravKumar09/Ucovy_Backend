const express = require("express");
const router = express.Router();
const controller = require("../controller/vendorController");

router.post("/vendor-request", controller.submitVendorRequest);
router.get("/vendor-request", controller.getVendorRequests);
router.post("/vendor-approve/:id", controller.approveVendor);
router.post("/vendor-reject/:id", controller.rejectVendor);

module.exports = router;
