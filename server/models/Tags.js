const mongoose = require("mongoose");

const TagsSchema = new mongoose.Schema({
  tagName: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  dares: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dares",
    },
  ],
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Posts",
    },
  ],
});

module.exports = mongoose.model("Tags", TagsSchema);
