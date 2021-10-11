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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUPPORTED_SOCIAL_PLATFORMS = exports.DEFAULT_PROFILE_IMAGE = exports.USER_GENDER = void 0;
const mongoose_1 = __importStar(require("mongoose"));
exports.USER_GENDER = ["male", "female"];
exports.DEFAULT_PROFILE_IMAGE = "/default/user.jpg";
exports.SUPPORTED_SOCIAL_PLATFORMS = ["facebook", "google"];
const likeSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    postId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
}, {
    timestamps: true,
});
const Like = mongoose_1.default.model("Like", likeSchema);
// MONGO DB CHANGE STREAMS
// Like.watch().on("change", (data: any) => {
//   console.log("Change Stream!");
// });
exports.default = Like;
