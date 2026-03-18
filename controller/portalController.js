const VendorRequest = require("../models/VendorRequest");
const Job = require("../models/Job");
const ResumeRequest = require("../models/ResumeRequest");

/**
 * POST /api/portal/request-resume
 * Body: { jobId?, candidateId?, accessCode }
 * Validates vendor access code, then optionally saves a resume request
 * and returns candidate/job details (name, phone, email, resumeUrl).
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
          companyName: vendor.companyName ?? null,
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

    // Save resume request record (for admin listing)
    await ResumeRequest.create({
      vendorName: vendor.name,
      vendorCompanyName: vendor.companyName,
      vendorPhone: vendor.phone,
      vendorEmail: vendor.email,
      accessCode: vendor.accessCode,
      jobId: job._id,
      candidateName: job.firstName,
      candidatePhone: job.phone,
      candidateEmail: job.email,
      resumeUrl: job.resumeUrl,
    });

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

/**
 * GET /api/portal/resume-requests
 * Returns list of all resume requests with vendor + candidate info.
 */
exports.getResumeRequests = async (req, res) => {
  try {
    const requests = await ResumeRequest.find().sort({ createdAt: -1 }).lean();
    res.json(
      requests.map((r) => ({
        _id: r._id,
        vendorName: r.vendorName,
        vendorCompanyName: r.vendorCompanyName,
        vendorPhone: r.vendorPhone,
        vendorEmail: r.vendorEmail,
        accessCode: r.accessCode,
        candidateName: r.candidateName,
        candidatePhone: r.candidatePhone,
        candidateEmail: r.candidateEmail,
        resumeUrl: r.resumeUrl,
        createdAt: r.createdAt,
      }))
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Failed to load resume requests." });
  }
};

