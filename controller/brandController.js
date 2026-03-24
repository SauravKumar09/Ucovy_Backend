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
  try {
    const brands = await Brand.find();
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch brands", error: error.message });
  }
};

exports.deleteBrand = async (req, res) => {
  try {
    const deleted = await Brand.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Brand not found" });
    res.json({ message: "Brand deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete brand", error: error.message });
  }
};
