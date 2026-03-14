const VendorRequest = require("../models/VendorRequest");
const nodemailer = require("nodemailer");

async function sendAccessEmail(email, name, code) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || `Ucovy <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Vendor Access Code",
    html: `
      <h2>Hello ${name}</h2>
      <p>Your vendor account has been approved.</p>
      <h3>Your Access Code:</h3>
      <h1>${code}</h1>
      <p>Please keep this code safe.</p>
    `,
  });
}

exports.submitVendorRequest = async (req, res) => {
  try {
    const { name, companyName, phone, email } = req.body;
    const vendor = new VendorRequest({ name, companyName, phone, email, status: "pending" });
    await vendor.save();
    res.json({ message: "Request submitted. Waiting for admin approval." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getVendorRequests = async (req, res) => {
  try {
    const requests = await VendorRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.approveVendor = async (req, res) => {
  try {
    const vendor = await VendorRequest.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    const accessCode = String(Math.floor(100000 + Math.random() * 900000));
    vendor.status = "approved";
    vendor.accessCode = accessCode;
    await vendor.save();

    let emailSent = false;
    if (vendor.email && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        await sendAccessEmail(vendor.email, vendor.name, accessCode);
        emailSent = true;
      } catch (emailErr) {
        console.error("Approval email failed:", emailErr);
      }
    }

    if (emailSent) {
      res.json({ message: "Vendor approved and email sent", accessCode });
    } else {
      res.json({
        message: "Vendor approved. Share this access code manually: " + accessCode,
        accessCode,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.rejectVendor = async (req, res) => {
  try {
    const vendor = await VendorRequest.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    vendor.status = "rejected";
    await vendor.save();
    res.json({ message: "Vendor rejected" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
