"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_post_1 = __importDefault(require("./create-post"));
const do_like_1 = __importDefault(require("./do-like"));
const do_comment_1 = __importDefault(require("./do-comment"));
exports.default = {
    createPost: create_post_1.default,
    doLike: do_like_1.default,
    doComment: do_comment_1.default,
};
