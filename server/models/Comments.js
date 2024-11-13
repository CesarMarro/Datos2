const mongoose = require("mongoose");

const CommentsSchema = new mongoose.Schema({
  commentBody: {
    type: String,
    required: true,
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

module.exports = mongoose.model("Comments", CommentsSchema);
