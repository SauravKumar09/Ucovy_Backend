const Stat = require("../models/Stat");

exports.addStat = async (req, res) => {

  try {

    const { number, mainText, subText } = req.body;

    const stat = new Stat({
      number,
      mainText,
      subText
    });

    await stat.save();

    res.json(stat);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};

exports.getStats = async (req, res) => {

  const stats = await Stat.find().sort({ number: 1 });

  res.json(stats);

};
