const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

const testimonialController = require("../controller/testimonialController");

// Ensure uploads folder exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// Routes
router.post("/", upload.single("image"), testimonialController.addTestimonial);
router.get("/", testimonialController.getTestimonials);
router.delete("/:id", testimonialController.deleteTestimonial);

module.exports = router;
