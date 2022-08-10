const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
  _id: {
    type: String,
    required: true
  }, 
  uploadTime: {
    type: Date,
    require: true
  },
  owner: {
    type: String,
    required: true
  },
  artType: {
    type: String,
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  images: [String]
})

const BlogModel = mongoose.model("Blog", blogSchema)

module.exports = { blogSchema, BlogModel }

