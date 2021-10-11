import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { sendWelcomeMail, sendRPMail } from "./../utils/nodemailer";
import { currentDateTime } from "./../utils/date";
import { genCrypto } from "./../utils/crypto";
import AccountRequest from "./AccountRequest";

export const NOTIFICATION_TYPES: String[] = [
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

const notificationSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    notificationTitle: {
      type: String,
    },
    notificationDescription: {
      type: String,
    },
    notificationType: {
      type: String,
      enum: NOTIFICATION_TYPES,
      default: "other",
    },
    relatedPostId: { type: Schema.Types.ObjectId, ref: "Post" },
    relatedUserId: { type: Schema.Types.ObjectId, ref: "User" },
    messageId: { type: Schema.Types.ObjectId },
    deepLink: { type: String },
    notificationImageUrl: { type: String },
    actions: [],
    isSeen: { type: Boolean, default: false },
    seenOn: { type: Date },
  },
  {
    timestamps: true,
  }
);

notificationSchema.pre("save", function (next) {
  //send notification to the device
  var user: any = this;
  console.log("Notification");
  next();
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
