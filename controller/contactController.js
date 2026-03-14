
const Contact = require("../models/Contact");

exports.submitContact = async (req, res) => {
    const contact = new Contact(req.body);
    await contact.save();
    res.json({ message: "Message submitted"});
};

exports.getContacts = async (req, res) => {
    const contacts = await Contact.find();
    res.json(contacts);
}