"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const format_response_1 = __importDefault(require("./../../utils/format-response"));
const validator_result_1 = __importDefault(require("../../utils/validator-result"));
const crypto_1 = require("../../utils/crypto");
const User_1 = __importDefault(require("./../../models/User"));
// POST /api/v1/auth/forgot-password
exports.default = async (req, res, next) => {
    try {
        //validation check
        const isValid = await validator_result_1.default(req, "Invalid Parameters", 422);
        if (!isValid) {
            return;
        }
        const { email, } = req.body;
        console.log("Reset pass request >", req.body);
        const user = await User_1.default.findOne({
            email: email,
            "control.isBlocked": false,
        });
        if (user) {
            console.log("User found >", user);
            const token = await crypto_1.genCrypto();
            await user.forgotPassword(token);
        }
        return res
            .status(200)
            .json(format_response_1.default("If we find any account accosiated with that email. We will send you the reset password link", {}));
    }
    catch (err) {
        console.log(err);
        next(format_response_1.default(err.message, process.env.NODE_ENV === "production" ? {} : err.data || err, false, err));
    }
};
