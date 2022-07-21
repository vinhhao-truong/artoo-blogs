const mongoose = require('mongoose');

const { blogSchema } = require('./Blog');

const userSchema = mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  artName: String,
  dob: {
    type: Date,
    required: true
  },
  myBlogs: [blogSchema]
})

const UserModel = mongoose.model("User", userSchema)

module.exports = { userSchema, UserModel }

