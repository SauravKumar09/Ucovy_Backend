const express = require("express");
const cors = require("cors");
const path = require("path");

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
const blogRoutes = require("./routes/blogRoutes");
const jobApplicationRoutes = require("./routes/jobApplicationRoutes");
const uploadRoute = require("./routes/uploadRoute");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "https://ucovy.netlify.app",
  "https://ucovy-admin.netlify.app",
  "https://ucovy-website.netlify.app"
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
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const mountRoutes = (apiPath, aliasPath, router) => {
  app.use(`/api${apiPath}`, router);
  app.use(aliasPath, router);
};

mountRoutes("/auth", "/auth", authRoutes);
mountRoutes("/hero", "/hero", require("./routes/heroRoutes"));
mountRoutes("/stats", "/stats", require("./routes/statRoutes"));
mountRoutes("/brands", "/brands", require("./routes/brandRoutes"));
mountRoutes("/timeline", "/timeline", require("./routes/timelineRoutes"));
mountRoutes("/principles", "/principles", require("./routes/principlesRoutes"));
mountRoutes("/testimonials", "/testimonials", testimonialRoutes);
mountRoutes("/careers", "/careers", careerRoutes);
mountRoutes("/contact", "/contact", contactRoutes);
mountRoutes("/jobs", "/jobs", jobRoutes);
mountRoutes("/ceipal", "/ceipal", ceipalRoutes);
mountRoutes("/portal", "/portal", portalRoutes);
mountRoutes("/insights", "/insights", insightRoutes);
mountRoutes("/insight-list", "/insight-list", insightListRoutes);
mountRoutes("/blogs", "/blogs", blogRoutes);
mountRoutes("/job-applications", "/job-applications", jobApplicationRoutes);
mountRoutes("/upload", "/upload", uploadRoute);

app.use("/api", vendorRoutes);
app.use("/", vendorRoutes);

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "API is running" });
});

app.use("/api/*splat", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

module.exports = app;
