"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const signup_1 = __importDefault(require("./signup"));
const login_1 = __importDefault(require("./login"));
const forgot_password_1 = __importDefault(require("./forgot-password"));
const reset_password_1 = __importDefault(require("./reset-password"));
const verify_request_1 = __importDefault(require("./verify-request"));
const verify_reset_password_request_1 = __importDefault(require("./verify-reset-password-request"));
exports.default = {
    signup: signup_1.default,
    login: login_1.default,
    forgotPassword: forgot_password_1.default,
    resetPassword: reset_password_1.default,
    verifyRequest: verify_request_1.default,
    verifyResetPasswordRequest: verify_reset_password_request_1.default,
};
