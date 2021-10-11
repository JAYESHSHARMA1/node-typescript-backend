import { Router } from "express";
//import validations
import signupValidations from "./../validations/auth/signup";
import loginValidations from "./../validations/auth/login";
import forgotPasswordValidations from "./../validations/auth/forgot-password";
import VerificationValidations from "./../validations/auth/verification";
import ResetPasswordValidations from "./../validations/auth/reset-password";
//initialize router
const router = Router();

//import user controllers
import authController from "../controllers/auth/index";

/* initialize auth routes /api/v1/auth/
/signup 
/login
/forgot-password
/reset-password
/verify-user
*/

router.route("/signup").post(signupValidations(), authController.signup);
router.route("/signin").post(loginValidations(), authController.login);

router
  .route("/forgot-password")
  .post(forgotPasswordValidations(), authController.forgotPassword);

router
  .route("/verify-reset-password")
  .post(VerificationValidations(), authController.verifyResetPasswordRequest);

router
  .route("/reset-password")
  .post(ResetPasswordValidations(), authController.resetPassword);

router
  .route("/verify-user")
  .post(VerificationValidations(), authController.verifyRequest);

export default router;
