"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
//import validations
const create_post_1 = __importDefault(require("../validations/post/create-post"));
// import doLikeValidations from "../validations/post/do-like";
const multer_1 = require("../utils/multer");
//initialize router
const router = express_1.Router();
//import user controllers
const index_1 = __importDefault(require("../controllers/post/index"));
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
    .post(multer_1.postImageMulter.array("files", 4), create_post_1.default(), index_1.default.createPost);
router.route("/:postId/like").put(index_1.default.doLike);
router.route("/:postId/comment").put(index_1.default.doComment);
exports.default = router;
