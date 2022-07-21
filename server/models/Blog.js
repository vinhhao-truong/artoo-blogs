const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ["Literature", "Painting", "Music", "Movie", ""]
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
})

const BlogModel = mongoose.model("Blog", blogSchema)

module.exports = { blogSchema, BlogModel }

