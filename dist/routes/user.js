"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
//import file uploader
const multer_1 = require("./../utils/multer");
const index_1 = __importDefault(require("./../controllers/user/index"));
// //profile image uploader
router
    .route("/profile")
    .post(multer_1.profileImageMulter.single("image"), index_1.default.uploadProfile);
exports.default = router;
