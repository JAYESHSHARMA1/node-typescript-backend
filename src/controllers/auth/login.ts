import { Request, Response, NextFunction } from "express";

import fr from "./../../utils/format-response";
import validationCheck from "../../utils/validator-result";
import { signToken } from "../../utils/jwt";
import User from "./../../models/User";

//login filter function
const getLoginFilter = (email: string) => {
  return {
    $or: [{ email: email }, { userName: email }],
    "verification.emailVerified": true,
    "control.isBlocked": false,
  };
};

// POST /api/v1/auth/login
export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    //validation check
    const isValid = await validationCheck(req, "Invalid Parameters", 422);
    if (!isValid) {
      return;
    }
    const {
      email,
      password,
    }: {
      email: string;
      password: string;
    } = req.body;
    console.log(req.body);
    const options = getLoginFilter(email);
    console.log(options);
    const user: any = await User.findOne(options);
    if (!user) {
      const error: any = new Error(
        "Invalid email, password Or Email not verified."
      );
      error.statusCode = 401;
      error.message = "Invalid email, password Or Email not verified.";
      throw error;
    }
    if (user.control.isBlocked) {
      const error: any = new Error("Account Blocked Contact Support");
      error.statusCode = 400;
      error.message = "Account Blocked Contact Support";
      throw error;
    }
    const isMatched = await user.comparePassword(password);
    if (!isMatched) {
      const error: any = new Error("Invalid email or password");
      error.statusCode = 401;
      error.message = "Invalid email or password";
      throw error;
    } else {
      let resUser = { ...user._doc };
      delete resUser.password;
      const token = await signToken(resUser);
      return res
        .status(200)
        .json(
          fr("Login Successfully", { ...resUser, token, expiresIn: "21600" })
        );
    }
  } catch (err) {
    console.log(err);
    next(
      fr(
        err.message,
        process.env.NODE_ENV === "production" ? {} : err.data || err,
        false,
        err
      )
    );
  }
};
