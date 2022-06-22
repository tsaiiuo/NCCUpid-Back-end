const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  isIntroSet: {
    type: Boolean,
    default: false,
  },
  age: {
    type: Number,
    default: 0,
  },
  home: {
    type: String,
    min: 2,
    max: 20,
  },
  gender: {
    type: String,
  },
  major: {
    type: String,
    min: 2,
    max: 20,
  },
  gangs: [],
  habits: [],
  hates: [],
  positive: {
    type: String,
  },
  isAvatarImageSet: {
    type: Boolean,
    default: false,
  },
  avatarImage: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Users", userSchema);
