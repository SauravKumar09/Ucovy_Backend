const VendorRequest = require("../models/VendorRequest");
const Job = require("../models/Job");

/**
 * POST /api/portal/request-resume
 * Body: { jobId?, candidateId?, accessCode }
 * Validates vendor access code, then returns candidate/job details (name, phone, email, resumeUrl).
 */
exports.requestResume = async (req, res) => {
  try {
    const { jobId, candidateId, accessCode } = req.body || {};

    if (!accessCode || !String(accessCode).trim()) {
      return res.status(400).json({
        success: false,
        message: "Access code is required.",
      });
    }

    const vendor = await VendorRequest.findOne({
      accessCode: String(accessCode).trim(),
      status: "approved",
    });

    if (!vendor) {
      return res.status(401).json({
        success: false,
        message: "Invalid or inactive access code.",
      });
    }

    const id = (jobId || candidateId || "").toString().trim();

    if (!id) {
      // No job/candidate selected: return list of jobs; phone & email from VendorRequest (same access code)
      const jobs = await Job.find()
        .sort({ createdAt: -1 })
        .select("_id firstName phone email resumeUrl jobTitle experience state createdAt")
        .lean();
      return res.json({
        success: true,
        vendor: {
          name: vendor.name,
          phone: vendor.phone ?? null,
          email: vendor.email ?? null,
        },
        jobs: jobs.map((j) => ({
          _id: j._id,
          name: j.firstName,
          phone: vendor.phone ?? j.phone ?? null,
          email: vendor.email ?? j.email ?? null,
          resumeUrl: j.resumeUrl || null,
          jobTitle: j.jobTitle,
          experience: j.experience,
          state: j.state,
          createdAt: j.createdAt ? new Date(j.createdAt).toISOString() : null,
        })),
      });
    }

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job / candidate not found.",
      });
    }

    res.json({
      success: true,
      candidate: {
        firstName: job.firstName,
        jobTitle: job.jobTitle,
        experience: job.experience,
        workAuthorization: job.workAuthorization,
        state: job.state,
        phone: job.phone,
        email: job.email,
        resumeUrl: job.resumeUrl,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong.",
    });
  }
};
