"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST_TYPES = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const Like_1 = __importDefault(require("./Like"));
const Comment_1 = __importDefault(require("./Comment"));
exports.POST_TYPES = ["image", "video"];
const postSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    description: {
        type: String,
    },
    postType: {
        type: String,
        enum: exports.POST_TYPES,
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
                    type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
postSchema.methods.doLike = function (userId) {
    return new Promise(async (resolve, reject) => {
        try {
            const post = this;
            const isAlreadyLiked = await Like_1.default.findOne({
                userId,
                postId: post._id,
            });
            if (isAlreadyLiked) {
                throw new Error("Already liked");
            }
            post.meta.likes++;
            await post.save();
            const like = new Like_1.default({
                userId,
                postId: post._id,
            });
            await like.save();
            resolve(true);
        }
        catch (error) {
            reject(error);
        }
    });
};
postSchema.methods.doComment = function (userId, comment, isReply = false, commentId = null) {
    return new Promise(async (resolve, reject) => {
        try {
            const post = this;
            post.meta.comments++;
            await post.save();
            const newComment = new Comment_1.default({
                userId,
                postId: post._id,
                isReply,
                comment,
                commentId: isReply !== null ? commentId : undefined,
            });
            await newComment.save();
            resolve(true);
        }
        catch (error) {
            reject(error);
        }
    });
};
const Post = mongoose_1.default.model("Post", postSchema);
// MONGO DB CHANGE STREAMS
Post.watch().on("change", async (data) => {
    if (data.operationType === "insert") {
        console.log("new post");
        const post = data.fullDocument;
        //send notification to all followers
        try {
            // console.log(">>>>>> New Post", post);
        }
        catch (error) {
            console.log(error);
        }
    }
});
exports.default = Post;
