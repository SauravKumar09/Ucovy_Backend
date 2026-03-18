const mongoose = require("mongoose");

const resumeRequestSchema = new mongoose.Schema(
  {
    // Vendor (who is requesting)
    vendorName: String,
    vendorCompanyName: String,
    vendorPhone: String,
    vendorEmail: String,
    accessCode: String,

    // Candidate / job info
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
    candidateName: String,
    candidatePhone: String,
    candidateEmail: String,
    resumeUrl: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("ResumeRequest", resumeRequestSchema);

