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
exports.NOTIFICATION_TYPES = void 0;
const mongoose_1 = __importStar(require("mongoose"));
exports.NOTIFICATION_TYPES = [
    "new-post",
    "post-like",
    "new-comment",
    "comment-reply",
    "from-admin",
    "new-follow-request",
    "started-following",
    "upcoming-event",
    "following-added-new-event",
    "new-message",
    "reaction-on-message",
    "reply-on-message",
    "other",
];
const notificationSchema = new mongoose_1.Schema({
    ownerId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    notificationTitle: {
        type: String,
    },
    notificationDescription: {
        type: String,
    },
    notificationType: {
        type: String,
        enum: exports.NOTIFICATION_TYPES,
        default: "other",
    },
    relatedPostId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Post" },
    relatedUserId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    messageId: { type: mongoose_1.Schema.Types.ObjectId },
    deepLink: { type: String },
    notificationImageUrl: { type: String },
    actions: [],
    isSeen: { type: Boolean, default: false },
    seenOn: { type: Date },
}, {
    timestamps: true,
});
notificationSchema.pre("save", function (next) {
    //send notification to the device
    var user = this;
    console.log("Notification");
    next();
});
const Notification = mongoose_1.default.model("Notification", notificationSchema);
exports.default = Notification;
