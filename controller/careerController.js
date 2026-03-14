const Career = require("../models/Career");

exports.addCareer = async (req, res) => {
  try {

    const career = new Career({
      role: req.body.role,
      description: req.body.description,
      experience: req.body.experience,
      location: req.body.location
    });

    await career.save();

    res.status(201).json(career);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCareers = async (req, res) => {
  try {

    const careers = await Career.find();
    res.json(careers);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
