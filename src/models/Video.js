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
});

const Video = mongoose.model("Video", videoSchma);
export default Video;
