import mongoose from "mongoose";

// String == { type: String }
const videoSchma = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minLength: 10,
    maxLength: 80,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxLength: 140,
    minLength: 20,
  },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
  fileUrl: { type: String, required: true },
  thumbUrl: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

// static method ( function )
videoSchma.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((w) => (w.startsWith("#") ? w : `#${w.trim()}`));
});

/*
batter then more
videoSchma.pre("save", async function () {
  this.hashtags = this.hashtags[0]
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});
*/

const Video = mongoose.model("Video", videoSchma);
export default Video;
