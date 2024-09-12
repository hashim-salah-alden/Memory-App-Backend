const mongoose = require("mongoose");

const memoriesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  creator: { type: String },
  tags: [{ type: String, required: true }],
  likeCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  creator: String,
  image: { type: String, default: "memoryImage.png" },
});

module.exports = mongoose.model("Memory", memoriesSchema);
