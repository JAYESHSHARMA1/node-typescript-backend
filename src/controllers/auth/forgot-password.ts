import { Request, Response, NextFunction } from "express";

import fr from "./../../utils/format-response";
import validationCheck from "../../utils/validator-result";
import { genCrypto } from "../../utils/crypto";
import User from "./../../models/User";

// POST /api/v1/auth/forgot-password
export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    //validation check
    const isValid = await validationCheck(req, "Invalid Parameters", 422);
    if (!isValid) {
      return;
    }

    const {
      email,
    }: {
      email: string;
    } = req.body;
    console.log("Reset pass request >", req.body);
    const user: any = await User.findOne({
      email: email,
      "control.isBlocked": false,
    });
    if (user) {
      console.log("User found >", user);
      const token = await genCrypto();
      await user.forgotPassword(token);
    }

    return res
      .status(200)
      .json(
        fr(
          "If we find any account accosiated with that email. We will send you the reset password link",
          {}
        )
      );
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
