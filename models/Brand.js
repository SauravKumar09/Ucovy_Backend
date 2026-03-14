const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
{
  name: String,
  logo: String
},
{ timestamps: true }
);

module.exports = mongoose.model("Brand", brandSchema);
