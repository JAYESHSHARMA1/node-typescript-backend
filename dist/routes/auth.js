"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
//import validations
const signup_1 = __importDefault(require("./../validations/auth/signup"));
const login_1 = __importDefault(require("./../validations/auth/login"));
const forgot_password_1 = __importDefault(require("./../validations/auth/forgot-password"));
const verification_1 = __importDefault(require("./../validations/auth/verification"));
const reset_password_1 = __importDefault(require("./../validations/auth/reset-password"));
//initialize router
const router = express_1.Router();
//import user controllers
const index_1 = __importDefault(require("../controllers/auth/index"));
/* initialize auth routes /api/v1/auth/
/signup
/login
/forgot-password
/reset-password
/verify-user
*/
router.route("/signup").post(signup_1.default(), index_1.default.signup);
router.route("/signin").post(login_1.default(), index_1.default.login);
router
    .route("/forgot-password")
    .post(forgot_password_1.default(), index_1.default.forgotPassword);
router
    .route("/verify-reset-password")
    .post(verification_1.default(), index_1.default.verifyResetPasswordRequest);
router
    .route("/reset-password")
    .post(reset_password_1.default(), index_1.default.resetPassword);
router
    .route("/verify-user")
    .post(verification_1.default(), index_1.default.verifyRequest);
exports.default = router;
