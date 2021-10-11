"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_result_1 = __importDefault(require("../../utils/validator-result"));
const User_1 = __importDefault(require("./../../models/User"));
const format_response_1 = __importDefault(require("./../../utils/format-response"));
// POST /api/v1/auth/signup
exports.default = async (req, res, next) => {
    try {
        //validation check
        const isValid = await validator_result_1.default(req, "Invalid Parameters", 422);
        if (!isValid) {
            return;
        }
        const { email, userName, password, fullName, deviceToken, deviceType } = req.body;
        const lowerCaseEmail = email.toLowerCase();
        const user = new User_1.default({
            email: lowerCaseEmail,
            password,
            userName,
            profile: { fullName },
            devices: [{ deviceToken, deviceType }],
        });
        await user.save();
        return res
            .status(201)
            .json(format_response_1.default("User Created Successfully", { userId: user._id }));
        // .json({ message: "User Created Successfully", userId: user._id });
    }
    catch (err) {
        next(format_response_1.default(err.message, err.data, //process.env.NODE_ENV === "production" ? {} : err.data || err,
        false, err));
    }
};
