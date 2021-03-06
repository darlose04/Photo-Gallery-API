const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  file: {
    type: Object
  },
  title: {
    type: String,
    required: true
  },
  width: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  }
});

const Image = mongoose.model("Image", ImageSchema);

module.exports = Image;
