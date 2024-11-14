const mongoose = require("mongoose");

const PostsSchema = new mongoose.Schema({
  postText: {
    type: String,
    required: true,
  },
  photoUrl: {
    type: String,
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  pointsAwarded: {
    type: Boolean,
    default: false,
  },
  DareId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dares",
  },
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tags",
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comments",
    },
  ],
  ratings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ratings",
    },
  ],
});

module.exports = mongoose.model("Posts", PostsSchema);
