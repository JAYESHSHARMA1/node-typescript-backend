import { Router } from "express";
//import validations
import createPostValidations from "../validations/post/create-post";
// import doLikeValidations from "../validations/post/do-like";
import { postImageMulter } from "../utils/multer";

//initialize router
const router = Router();

//import user controllers
import postController from "../controllers/post/index";

/* initialize auth routes /api/v1/post/

POST /
PATCH /:postId
GET /:postId
PUT /:postId/comment
PUT /:postId/like
DELETE /:postId
*/

router
  .route("/")
  .post(
    postImageMulter.array("files", 4),
    createPostValidations(),
    postController.createPost
  );
router.route("/:postId/like").put(postController.doLike);
router.route("/:postId/comment").put(postController.doComment);

export default router;
