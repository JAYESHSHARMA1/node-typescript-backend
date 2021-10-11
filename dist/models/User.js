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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUPPORTED_DEVICE_TYPES = exports.SUPPORTED_SOCIAL_PLATFORMS = exports.DEFAULT_PROFILE_IMAGE = exports.USER_GENDER = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const nodemailer_1 = require("./../utils/nodemailer");
const date_1 = require("./../utils/date");
const crypto_1 = require("./../utils/crypto");
const AccountRequest_1 = __importStar(require("./AccountRequest"));
exports.USER_GENDER = ["male", "female"];
exports.DEFAULT_PROFILE_IMAGE = "/default/user.jpg";
exports.SUPPORTED_SOCIAL_PLATFORMS = ["facebook", "google"];
exports.SUPPORTED_DEVICE_TYPES = ["android", "ios", "web"];
const userSchema = new mongoose_1.Schema({
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
            type: mongoose_1.Schema.Types.ObjectId,
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
            default: exports.DEFAULT_PROFILE_IMAGE,
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
            enum: exports.USER_GENDER,
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
                enum: exports.SUPPORTED_SOCIAL_PLATFORMS,
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
        type: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "AccountRequest" }],
        required: true,
        defualt: [],
    },
    devices: [
        {
            deviceToken: { type: String },
            deviceType: { type: String, enum: exports.SUPPORTED_DEVICE_TYPES },
            addedOn: { type: Date, default: date_1.currentDateTime() },
        },
    ],
}, {
    timestamps: true,
});
userSchema.pre("save", function (next) {
    var user = this;
    if (user.isModified("password")) {
        bcryptjs_1.default.genSalt(12, (err, salt) => {
            console.error("Error pass crypt :", err);
            bcryptjs_1.default.hash(user.password, salt, (error, hash) => {
                console.error("Error pass crypt :", error);
                user.password = hash;
                next();
            });
        });
    }
    else {
        next();
    }
});
userSchema.methods.comparePassword = function (candidatePassword) {
    return new Promise((resolve, reject) => {
        const user = this;
        bcryptjs_1.default.compare(candidatePassword, user.password, function (err, isMatch) {
            if (err)
                return reject(err);
            return resolve(isMatch);
        });
    });
};
userSchema.methods.forgotPassword = function (token) {
    return new Promise(async (resolve, reject) => {
        try {
            const user = this;
            const request = new AccountRequest_1.default({
                userId: user._id,
                requestType: AccountRequest_1.REQUEST_TYPE["reset-password"],
                token: token,
            });
            await request.save();
            user.activeAccountRequests.push(request._id);
            await user.save();
            const resetPasswordLink = `${process.env.APP_DOMAIN}/verify-reset-password/${request._id}/${token}`;
            await nodemailer_1.sendRPMail(user, resetPasswordLink);
            return resolve(true);
        }
        catch (error) {
            return reject(error);
        }
    });
};
userSchema.methods.changePassword = function (newPassword) {
    return new Promise(async (resolve, reject) => {
        try {
            let user = this;
            user["password"] = newPassword;
            const signInUrl = `${process.env.APP_DOMAIN}/signin`;
            await user.save();
            await nodemailer_1.sendPasswordChangedSuccessfulMail(user, signInUrl);
            return resolve(true);
        }
        catch (err) {
            console.log(err);
            return resolve(false);
        }
    });
};
userSchema.methods.verifyEmail = function () {
    return new Promise(async (resolve, reject) => {
        try {
            let user = this;
            if (user.control.isBlocked === true ||
                user.verification.emailVerified === true)
                throw "Invalid account. Cannot Verify!";
            user["verification"]["emailVerified"] = true;
            const signInUrl = `${process.env.APP_DOMAIN}/signin`;
            await user.save();
            await nodemailer_1.sendVerifiedEmailSuccessMail(user, signInUrl);
            return resolve(true);
        }
        catch (error) {
            console.log(error, "Model User");
            return resolve(false);
        }
    });
};
const User = mongoose_1.default.model("User", userSchema);
// MONGO DB CHANGE STREAMS
User.watch().on("change", async (data) => {
    if (data.operationType === "insert") {
        console.log("generating request");
        const user = data.fullDocument;
        try {
            const domain = process.env.APP_DOMAIN;
            const token = await crypto_1.genCrypto();
            const request = new AccountRequest_1.default({
                userId: user._id,
                requestType: AccountRequest_1.REQUEST_TYPE["verify-email"],
                token: token,
            });
            await request.save();
            await User.updateOne({ _id: user._id }, {
                $addToSet: {
                    activeAccountRequests: request._id,
                },
            });
            const accountVerificationLink = `${domain}/verify-email/${request._id}/${token}`;
            //send verification mail here
            const result = await nodemailer_1.sendWelcomeMail(user, accountVerificationLink);
        }
        catch (error) {
            console.log(error);
        }
    }
});
exports.default = User;
