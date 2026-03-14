const express = require("express");
const router = express.Router();

const brandController = require("../controller/brandController");
const upload = require("../middleware/uploadMiddleware");

router.post("/add", upload.single("logo"), brandController.addBrand);

router.get("/", brandController.getBrands);

module.exports = router;
