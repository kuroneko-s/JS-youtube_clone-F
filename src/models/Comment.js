import mongoose, { mongo } from "mongoose";

const commentSchema = mongoose.Schema({
  createAt: {
    type: Date,
    require: true,
    default: Date.now,
  },
  text: {
    type: String,
    require: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "User",
  },
  video: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "Video",
  },
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
