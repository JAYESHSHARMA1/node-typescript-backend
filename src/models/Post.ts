import mongoose, { Schema } from "mongoose";
import Like from "./Like";
import Comment from "./Comment";

export const POST_TYPES: String[] = ["image", "video"];

const postSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
    },
    postType: {
      type: String,
      enum: POST_TYPES,
      required: true,
    },
    resourceUrls: [],
    hashTags: [],
    usersTags: {
      type: [
        {
          userName: {
            type: String,
          },
          userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
          },
        },
      ],
      default: [],
    },
    location: {
      cords: {
        lat: { type: String },
        lng: { type: String },
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      country: {
        type: String,
      },
    },
    meta: {
      likes: {
        type: Number,
        required: true,
        default: 0,
      },
      comments: {
        type: Number,
        required: true,
        default: 0,
      },
    },
    control: {
      isBlocked: {
        type: Boolean,
        default: false,
      },
      isSensitive: {
        type: Boolean,
        default: false,
      },
      isCommentsEnabled: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

postSchema.methods.doLike = function (userId: Schema.Types.ObjectId) {
  return new Promise(async (resolve, reject) => {
    try {
      const post: any = this;
      const isAlreadyLiked = await Like.findOne({
        userId,
        postId: post._id,
      });
      if (isAlreadyLiked) {
        throw new Error("Already liked");
      }
      post.meta.likes++;
      await post.save();
      const like: any = new Like({
        userId,
        postId: post._id,
      });
      await like.save();
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

postSchema.methods.doComment = function (
  userId: Schema.Types.ObjectId,
  comment: string,
  isReply: boolean = false,
  commentId: any = null
) {
  return new Promise(async (resolve, reject) => {
    try {
      const post: any = this;
      post.meta.comments++;
      await post.save();
      const newComment: any = new Comment({
        userId,
        postId: post._id,
        isReply,
        comment,
        commentId: isReply !== null ? commentId : undefined,
      });
      await newComment.save();
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

const Post = mongoose.model("Post", postSchema);
// MONGO DB CHANGE STREAMS
Post.watch().on("change", async (data: any) => {
  if (data.operationType === "insert") {
    console.log("new post");
    const post = data.fullDocument;
    //send notification to all followers

    try {
      // console.log(">>>>>> New Post", post);
    } catch (error) {
      console.log(error);
    }
  }
});

export default Post;
