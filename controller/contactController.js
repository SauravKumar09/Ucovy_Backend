const Contact = require("../models/Contact");

const normalizePayload = (body = {}) => {
  const {
    fullName,
    name,
    full_name,
    email,
    phone = "",
    phoneNumber = "",
    phone_number = "",
    companyName = "",
    company = "",
    company_name = "",
    message = "",
  } = body;

  return {
    fullName: String(fullName || full_name || name || "").trim(),
    email: String(email || "").trim(),
    phone: String(phone || phoneNumber || phone_number || "").trim(),
    companyName: String(companyName || company || company_name || "").trim(),
    message: String(message || "").trim(),
  };
};

exports.submitContact = async (req, res) => {
  try {
    const normalized = normalizePayload(req.body);

    if (!normalized.fullName || !normalized.email) {
      return res.status(400).json({ message: "fullName and email are required" });
    }

    const contact = new Contact(req.body);
    contact.fullName = normalized.fullName;
    contact.email = normalized.email;
    contact.phone = normalized.phone;
    contact.companyName = normalized.companyName;
    contact.message = normalized.message;

    await contact.save();
    res.status(201).json({ message: "Message submitted", contact });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit contact", error: error.message });
  }
};

exports.getContacts = async (req, res) => {
  try {
    // Newest first for admin list
    const contacts = await Contact.find().sort({ createdAt: -1 });
    const normalized = contacts.map((item) => {
      const obj = item.toObject();
      return {
        ...obj,
        fullName: obj.fullName || obj.full_name || obj.name || "",
        phone: obj.phone || obj.phoneNumber || obj.phone_number || "",
        companyName: obj.companyName || obj.company_name || obj.company || "",
      };
    });
    res.json(normalized);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch contacts", error: error.message });
  }
};

exports.updateContact = async (req, res) => {
  try {
    const normalized = normalizePayload(req.body);
    if (!normalized.fullName || !normalized.email) {
      return res.status(400).json({ message: "fullName and email are required" });
    }

    const updated = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        fullName: normalized.fullName,
        email: normalized.email,
        phone: normalized.phone,
        companyName: normalized.companyName,
        message: normalized.message,
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json({ message: "Contact updated", contact: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update contact", error: error.message });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.json({ message: "Contact deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete contact", error: error.message });
  }
};