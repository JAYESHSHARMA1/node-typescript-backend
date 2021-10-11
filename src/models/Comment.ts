import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const commentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isReply: {
      type: Boolean,
      default: false,
      requried: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", commentSchema);

// MONGO DB CHANGE STREAMS
// Comment.watch().on("change", (data: any) => {
//   console.log("Change Stream!");
// });

export default Comment;
