const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const blogSchema = new mongoose.Schema({
  title: { type: String, required: [true, "Title is required"] },
  description: { type: String, required: [true, "Description is required"] },
  tags: [String],
  comments: [commentSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Blog', blogSchema);
