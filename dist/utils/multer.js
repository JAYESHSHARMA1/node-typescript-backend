"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postImageMulter = exports.profileImageMulter = void 0;
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg")
        cb(null, true);
    else
        cb(null, false);
};
const profileImageStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, "../", "../public/", "profile"));
    },
    filename: (req, file, cb) => {
        console.log(file.originalname, "<< original name of the file");
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const postsImageStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, "../", "../public/", "posts"));
    },
    filename: (req, file, cb) => {
        console.log(file, "<< original name of the file");
        cb(null, Date.now() + "-" + file.originalname);
    },
});
exports.profileImageMulter = multer_1.default({
    storage: profileImageStorage,
    fileFilter: fileFilter,
});
exports.postImageMulter = multer_1.default({
    storage: postsImageStorage,
    fileFilter: fileFilter,
});
