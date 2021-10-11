import { Request, Response, NextFunction } from "express";
import validationCheck from "../../utils/validator-result";
import { genCrypto } from "../../utils/crypto";
import User from "./../../models/User";
import AccountRequest, { REQUEST_TYPE } from "./../../models/AccountRequest";
import fr from "./../../utils/format-response";

import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

// POST /api/v1/auth/reset-password
export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    //validation check
    const isValid = await validationCheck(req, "Invalid Parameters", 422);
    if (!isValid) {
      return;
    }
    const {
      password,
      reqId,
      token,
    }: {
      password: string;
      reqId: string;
      token: string;
    } = req.body;
    console.log(req.body);
    const requestType = REQUEST_TYPE["reset-password"];
    console.log({ requestType: requestType, token: token, reqId: reqId });
    const request: any = await AccountRequest.findOne({
      requestType: requestType,
      token: token,
      _id: ObjectId(reqId),
      "control.isCompleted": false,
      "control.isBlocked": false,
    });

    if (!request) {
      throw { statusCode: 400, err: "Invalid Request" };
    }

    const user: any = await User.findOne({
      _id: ObjectId(request.userId),
      "control.isBlocked": false,
      "verification.emailVerified": true,
    });
    const changePasswordStatus = await user.changePassword(password);
    if (!changePasswordStatus)
      throw { statusCode: 400, err: "Invalid Request No User" };

    await AccountRequest.updateOne(
      {
        requestType: requestType,
        token: token,
        _id: ObjectId(reqId),
        "control.isCompleted": false,
        "control.isBlocked": false,
      },
      { $set: { "control.isCompleted": true } }
    );

    return res
      .status(200)
      .json(fr("Congratulations! Password Reset Successfull!", {}));
  } catch (err) {
    console.log(err);
    if (!err.statusCode) err.statusCode = 500;
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
