"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const format_response_1 = __importDefault(require("./../../utils/format-response"));
const validator_result_1 = __importDefault(require("../../utils/validator-result"));
const jwt_1 = require("../../utils/jwt");
const User_1 = __importDefault(require("./../../models/User"));
//login filter function
const getLoginFilter = (email) => {
    return {
        $or: [{ email: email }, { userName: email }],
        "verification.emailVerified": true,
        "control.isBlocked": false,
    };
};
// POST /api/v1/auth/login
exports.default = async (req, res, next) => {
    try {
        //validation check
        const isValid = await validator_result_1.default(req, "Invalid Parameters", 422);
        if (!isValid) {
            return;
        }
        const { email, password, } = req.body;
        console.log(req.body);
        const options = getLoginFilter(email);
        console.log(options);
        const user = await User_1.default.findOne(options);
        if (!user) {
            const error = new Error("Invalid email, password Or Email not verified.");
            error.statusCode = 401;
            error.message = "Invalid email, password Or Email not verified.";
            throw error;
        }
        if (user.control.isBlocked) {
            const error = new Error("Account Blocked Contact Support");
            error.statusCode = 400;
            error.message = "Account Blocked Contact Support";
            throw error;
        }
        const isMatched = await user.comparePassword(password);
        if (!isMatched) {
            const error = new Error("Invalid email or password");
            error.statusCode = 401;
            error.message = "Invalid email or password";
            throw error;
        }
        else {
            let resUser = { ...user._doc };
            delete resUser.password;
            const token = await jwt_1.signToken(resUser);
            return res
                .status(200)
                .json(format_response_1.default("Login Successfully", { ...resUser, token, expiresIn: "21600" }));
        }
    }
    catch (err) {
        console.log(err);
        next(format_response_1.default(err.message, process.env.NODE_ENV === "production" ? {} : err.data || err, false, err));
    }
};
