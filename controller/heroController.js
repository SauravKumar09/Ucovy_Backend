const Hero = require("../models/Hero");

exports.addHero = async (req, res) => {

  try {

    const { heading, subheading, description } = req.body;

    const hero = new Hero({
      heading,
      subheading,
      description
    });

    await hero.save();

    res.json(hero);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};


exports.getHero = async (req, res) => {

  try {

    const hero = await Hero.find();

    res.json(hero);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};
