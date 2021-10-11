import { Request, Response, NextFunction } from "express";
import validationCheck from "../../utils/validator-result";
import User from "./../../models/User";
import fr from "./../../utils/format-response";

// POST /api/v1/auth/signup
export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    //validation check
    const isValid = await validationCheck(req, "Invalid Parameters", 422);
    if (!isValid) {
      return;
    }
    const { email, userName, password, fullName, deviceToken, deviceType } =
      req.body;
    const lowerCaseEmail: string = email.toLowerCase();
    const user = new User({
      email: lowerCaseEmail,
      password,
      userName,
      profile: { fullName },
      devices: [{ deviceToken, deviceType }],
    });
    await user.save();

    return res
      .status(201)
      .json(fr("User Created Successfully", { userId: user._id }));
    // .json({ message: "User Created Successfully", userId: user._id });
  } catch (err) {
    next(
      fr(
        err.message,
        err.data, //process.env.NODE_ENV === "production" ? {} : err.data || err,
        false,
        err
      )
    );
  }
};
