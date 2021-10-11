"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Post_1 = __importDefault(require("../../models/Post"));
const validator_result_1 = __importDefault(require("../../utils/validator-result"));
// PUT /api/v1/post/:postId/like
exports.default = async (req, res, next) => {
    try {
        //validation check
        const isValid = await validator_result_1.default(req, "Invalid Parameters", 422);
        if (!isValid) {
            return;
        }
        const { postId } = req.params;
        const post = await Post_1.default.findOne({
            _id: postId,
            "control.isBlocked": false,
        });
        if (!post) {
            const error = new Error("Post not found");
            error.statusCode = 400;
            throw error;
        }
        await post.doLike(req.userId);
        return res.status(200).json({
            message: "Post Liked Successfully",
        });
    }
    catch (err) {
        console.log(err);
        if (!err.statusCode)
            err.statusCode = 500;
        next(err);
    }
};
