const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String, default: "" },
  desciption: { type: String, default: "" },
  image: { type: String, default: "/images/kitten.png" },
  author: { type: String, default: "Anonymous" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Project", ProjectSchema);
