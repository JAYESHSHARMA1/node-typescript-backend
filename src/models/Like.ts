import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

export const USER_GENDER: String[] = ["male", "female"];
export const DEFAULT_PROFILE_IMAGE: String = "/default/user.jpg";
export const SUPPORTED_SOCIAL_PLATFORMS: String[] = ["facebook", "google"];

const likeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Like = mongoose.model("Like", likeSchema);

// MONGO DB CHANGE STREAMS
// Like.watch().on("change", (data: any) => {
//   console.log("Change Stream!");
// });

export default Like;
