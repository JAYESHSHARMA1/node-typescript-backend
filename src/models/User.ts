import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import {
  sendWelcomeMail,
  sendRPMail,
  sendVerifiedEmailSuccessMail,
  sendPasswordChangedSuccessfulMail,
} from "./../utils/nodemailer";
import { currentDateTime } from "./../utils/date";
import { genCrypto } from "./../utils/crypto";
import AccountRequest, { REQUEST_TYPE } from "./AccountRequest";

export const USER_GENDER: String[] = ["male", "female"];
export const DEFAULT_PROFILE_IMAGE: String = "/default/user.jpg";
export const SUPPORTED_SOCIAL_PLATFORMS: String[] = ["facebook", "google"];
export const SUPPORTED_DEVICE_TYPES: String[] = ["android", "ios", "web"];

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    profile: {
      fullName: {
        type: String,
        required: true,
      },
      profileImageUrl: {
        type: String,
        default: DEFAULT_PROFILE_IMAGE,
        required: true,
      },
      bio: {
        type: String,
        required: true,
        default: "Hey guys, I'm at Everest..!",
      },
      website: {
        type: String,
        default: "",
      },
      gender: {
        type: String,
        enum: USER_GENDER,
      },
      dateOfBirth: {
        type: String,
      },
      address: {
        addressLine1: {
          type: String,
        },
        addressLine2: {
          type: String,
        },
        city: {
          type: String,
        },
        state: {
          type: String,
        },
        country: {
          type: String,
        },
        pincode: {
          type: String,
        },
      },
    },
    loginStatus: {
      isOnline: {
        type: Boolean,
        default: false,
      },
      lastLogin: {
        type: Array,
        default: [String],
      },
    },
    verification: {
      emailVerified: {
        type: Boolean,
        default: false,
      },
      phoneVerified: {
        type: Boolean,
        default: false,
      },
    },
    socialAccounts: [
      {
        type: {
          type: String,
          enum: SUPPORTED_SOCIAL_PLATFORMS,
        },
        token: {
          type: String,
          default: "",
        },
      },
    ],
    privacySettings: {
      isPrivate: {
        type: Boolean,
        default: false,
      },
    },
    notificationSettings: {
      isEnabled: {
        type: Boolean,
        default: true,
      },
      isFollowNotificationEnabled: {
        type: Boolean,
        default: true,
      },
    },
    control: {
      isBlocked: {
        type: Boolean,
        default: false,
      },
    },
    activeAccountRequests: {
      type: [{ type: Schema.Types.ObjectId, ref: "AccountRequest" }],
      required: true,
      defualt: [],
    },
    devices: [
      {
        deviceToken: { type: String },
        deviceType: { type: String, enum: SUPPORTED_DEVICE_TYPES },
        addedOn: { type: Date, default: currentDateTime() },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  var user: any = this;
  if (user.isModified("password")) {
    bcrypt.genSalt(12, (err, salt) => {
      console.error("Error pass crypt :", err);
      bcrypt.hash(user.password, salt, (error, hash) => {
        console.error("Error pass crypt :", error);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (candidatePassword: string) {
  return new Promise((resolve, reject) => {
    const user: any = this;
    bcrypt.compare(candidatePassword, user.password, function (err, isMatch) {
      if (err) return reject(err);
      return resolve(isMatch);
    });
  });
};

userSchema.methods.forgotPassword = function (token: string) {
  return new Promise(async (resolve, reject) => {
    try {
      const user: any = this;
      const request = new AccountRequest({
        userId: user._id,
        requestType: REQUEST_TYPE["reset-password"],
        token: token,
      });
      await request.save();
      user.activeAccountRequests.push(request._id);
      await user.save();
      const resetPasswordLink: string = `${process.env.APP_DOMAIN}/verify-reset-password/${request._id}/${token}`;
      await sendRPMail(user, resetPasswordLink);

      return resolve(true);
    } catch (error) {
      return reject(error);
    }
  });
};

userSchema.methods.changePassword = function (newPassword: string) {
  return new Promise(async (resolve, reject) => {
    try {
      let user: any = this;
      user["password"] = newPassword;
      const signInUrl = `${process.env.APP_DOMAIN}/signin`;
      await user.save();
      await sendPasswordChangedSuccessfulMail(user, signInUrl);
      return resolve(true);
    } catch (err) {
      console.log(err);
      return resolve(false);
    }
  });
};

userSchema.methods.verifyEmail = function () {
  return new Promise(async (resolve, reject) => {
    try {
      let user: any = this;
      if (
        user.control.isBlocked === true ||
        user.verification.emailVerified === true
      )
        throw "Invalid account. Cannot Verify!";
      user["verification"]["emailVerified"] = true;
      const signInUrl = `${process.env.APP_DOMAIN}/signin`;
      await user.save();
      await sendVerifiedEmailSuccessMail(user, signInUrl);
      return resolve(true);
    } catch (error) {
      console.log(error, "Model User");
      return resolve(false);
    }
  });
};

const User = mongoose.model("User", userSchema);

// MONGO DB CHANGE STREAMS
User.watch().on("change", async (data: any) => {
  if (data.operationType === "insert") {
    console.log("generating request");
    const user = data.fullDocument;
    try {
      const domain = process.env.APP_DOMAIN;
      const token = await genCrypto();

      const request = new AccountRequest({
        userId: user._id,
        requestType: REQUEST_TYPE["verify-email"],
        token: token,
      });
      await request.save();
      await User.updateOne(
        { _id: user._id },
        {
          $addToSet: {
            activeAccountRequests: request._id,
          },
        }
      );

      const accountVerificationLink: string = `${domain}/verify-email/${request._id}/${token}`;

      //send verification mail here
      const result = await sendWelcomeMail(user, accountVerificationLink);
    } catch (error) {
      console.log(error);
    }
  }
});

export default User;
