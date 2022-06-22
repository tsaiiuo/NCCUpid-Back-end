const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  friends: [
    {
      friend: { type: String, required: true },
      time: { type: String },
    },
  ],
  matchs: [
    {
      match: { type: String, required: true },
      comfirm: { type: Boolean, default: false },
    },
  ],
});

module.exports = mongoose.model("Matchs", matchSchema);
