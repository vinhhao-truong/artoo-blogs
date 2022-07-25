const mongoose = require("mongoose");

// const { blogSchema } = require('./Blog');

const userSchema = mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  nickname: String,
  dob: {
    type: String,
    required: true,
  },
  pickedColor: {
    type: String,
    required: true,
  },
});

const UserModel = mongoose.model("User", userSchema);

module.exports = { userSchema, UserModel };
