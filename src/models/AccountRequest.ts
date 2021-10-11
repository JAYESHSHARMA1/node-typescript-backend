import mongoose, { Schema } from "mongoose";
import { sendWelcomeMail } from "./../utils/nodemailer";

export const REQUEST_TYPE: any = {
  "reset-password": "reset-password",
  "verify-email": "verify-email",
  "verify-account": "verify-account",
  "verify-phone": "verify-phone",
};

export const ALLOWED_REQUEST_TYPE: String[] = [
  REQUEST_TYPE["reset-password"],
  REQUEST_TYPE["verify-email"],
  REQUEST_TYPE["verify-account"],
  REQUEST_TYPE["verify-phone"],
];

const accountRequestSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    requestType: {
      type: String,
      required: true,
      enum: ALLOWED_REQUEST_TYPE,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    control: {
      isBlocked: {
        type: Boolean,
        required: true,
        default: false,
      },
      isCompleted: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

const AccountRequest = mongoose.model("AccountRequest", accountRequestSchema);

export default AccountRequest;
