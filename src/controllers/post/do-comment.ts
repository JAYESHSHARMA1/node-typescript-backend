import { Request, Response, NextFunction } from "express";
import Post from "../../models/Post";
import validationCheck from "../../utils/validator-result";

// PUT /api/v1/post/:postId/comment
export default async (req: any, res: Response, next: NextFunction) => {
  try {
    //validation check
    const isValid = await validationCheck(req, "Invalid Parameters", 422);
    if (!isValid) {
      return;
    }
    const { postId }: { postId: string } = req.params;
    const {
      comment,
      isReply,
      commentId,
    }: { comment: string; isReply: boolean; commentId?: string } = req.body;

    const post = await Post.findOne({
      _id: postId,
      "control.isBlocked": false,
      "control.isCommentsEnabled": true,
    });
    if (!post) {
      const error: any = new Error("Post not found");
      error.statusCode = 400;
      throw error;
    }
    await post.doComment(req.userId, comment, isReply || false, commentId);
    return res.status(200).json({
      message: "Commented Successfully",
    });
  } catch (err) {
    console.log(err);
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
