const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const careerRoutes = require("./routes/careerRoutes");
const contactRoutes = require("./routes/contactRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const jobRoutes = require("./routes/jobRoutes");
const portalRoutes = require("./routes/portalRoutes");
const ceipalRoutes = require("./routes/ceipalRoutes");
const insightRoutes = require("./routes/insightRoutes");
const insightListRoutes = require("./routes/insightListRoutes");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "https://ucovy.netlify.app",
  "https://ucovy-admin.netlify.app",
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static("uploads"));


app.use("/api/auth", authRoutes);
app.use("/api/hero", require("./routes/heroRoutes"));
app.use("/api/stats", require("./routes/statRoutes"));
app.use("/api/brands", require("./routes/brandRoutes"));
app.use("/api/timeline", require("./routes/timelineRoutes"));
app.use("/api/principles", require("./routes/principlesRoutes"));
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/ceipal", ceipalRoutes);
app.use("/api/portal", portalRoutes);
app.use("/api/insights", insightRoutes);
app.use("/api/insight-list", insightListRoutes);
app.use("/api", vendorRoutes);

module.exports = app;
