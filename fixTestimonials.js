// fixTestimonials.js

const mongoose = require("mongoose");
require("dotenv").config();

const Testimonial = require("./models/Testimonial");

async function fixOldTestimonials() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected for migration");

    const testimonials = await Testimonial.find();

    for (let t of testimonials) {
      if (!t.position) t.position = "Not Specified";
      if (!t.review) t.review = "No review yet";

      await t.save();
    }

    console.log("All old testimonials fixed successfully!");

    mongoose.disconnect();
  } catch (error) {
    console.error(error);
  }
}

fixOldTestimonials();
