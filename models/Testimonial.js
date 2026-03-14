const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        position: { type: String, required: true },
        review: { type: String, required: true },
        image: { type: String, required: true } // filename from multer
      },
{ timestamps: true }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);
