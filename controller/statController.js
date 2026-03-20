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

exports.updateStat = async (req, res) => {
  try {
    const { id } = req.params;
    const { number, mainText, subText } = req.body;

    const updated = await Stat.findByIdAndUpdate(
      id,
      { number, mainText, subText },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Stat not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update stat", error: error.message });
  }
};

exports.deleteStat = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Stat.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Stat not found" });
    }

    res.json({ message: "Stat deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete stat", error: error.message });
  }
};
