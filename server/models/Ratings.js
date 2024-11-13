const mongoose = require("mongoose");

const RatingsSchema = new mongoose.Schema({
  ratingValue: {
    type: Number,
    required: true,
    default: 0,
  },
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  PostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Posts",
  },
});

module.exports = mongoose.model("Ratings", RatingsSchema);
