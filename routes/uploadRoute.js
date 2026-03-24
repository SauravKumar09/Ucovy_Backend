const express = require("express");
const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");

const router = express.Router();

router.post(["/", "/upload"], upload.single("image"), async (req, res) => {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.status(500).json({
        message: "Cloudinary is not configured on server",
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "ucovy" }, (error, uploadResult) => {
          if (error) return reject(error);
          resolve(uploadResult);
        })
        .end(req.file.buffer);
    });

    res.json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error?.message || "Upload failed",
      cloudinary_error: error?.http_code ? `${error.http_code}` : undefined,
    });
  }
});

module.exports = router;
