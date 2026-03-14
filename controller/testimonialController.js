const Testimonial = require("../models/Testimonial");

exports.addTestimonial = async (req, res) => {
  try {

    const { name, position, review } = req.body;

    const testimonial = new Testimonial({
      name,
      position,
      review,
      image: req.file ? req.file.filename : ""
    });

    await testimonial.save();

    res.json(testimonial);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getTestimonials = async (req, res) => {

  const testimonials = await Testimonial.find();

  const formatted = testimonials.map((item) => ({
    id: item._id,
    review: item.review,
    name: item.name,
    position: item.position,
    img: item.image
  }));
  

  res.json(formatted);

};


exports.deleteTestimonial = async (req, res) => {

  await Testimonial.findByIdAndDelete(req.params.id);

  res.json({ message: "Testimonial deleted" });

};
