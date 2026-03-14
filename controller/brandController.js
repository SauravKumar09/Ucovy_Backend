const Brand = require("../models/Brand");

exports.addBrand = async (req, res) => {

  try {

    const { name } = req.body;

    const brand = new Brand({
      name,
      logo: req.file ? req.file.filename : null
    });

    await brand.save();

    res.json(brand);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

exports.getBrands = async (req, res) => {

  const brands = await Brand.find();

  res.json(brands);

};
