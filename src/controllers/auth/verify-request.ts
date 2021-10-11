import { Request, Response, NextFunction } from "express";
import validationCheck from "../../utils/validator-result";
import { genCrypto } from "../../utils/crypto";
import User from "./../../models/User";
import AccountRequest, { REQUEST_TYPE } from "./../../models/AccountRequest";
import fr from "./../../utils/format-response";

import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

// POST /api/v1/auth/verify-request
export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    //validation check
    const isValid = await validationCheck(req, "Invalid Parameters", 422);
    if (!isValid) {
      return;
    }
    const {
      reqId,
      token,
    }: {
      reqId: string;
      token: string;
    } = req.body;

    console.log(req.body);

    const requestType = REQUEST_TYPE["verify-email"];

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
      _id: request.userId,
      "control.isBlocked": false,
      "verification.emailVerified": false,
    });
    const verificationStatus = await user.verifyEmail();
    if (!verificationStatus)
      throw { statusCode: 400, err: "Invalid Request No User" };

    await AccountRequest.updateOne(
      {
        requestType: requestType,
        token: token,
        _id: ObjectId(reqId),
        "control.isCompleted": false,
        "control.isBlocked": false,
      },
      {
        $set: {
          "control.isCompleted": true,
        },
      }
    );

    return res
      .status(200)
      .json(fr("Congratulations! Account Verification Successfull!", {}));
  } catch (err) {
    console.log("error", err);
    if (!err.statusCode) err.statusCode = 500;
    next(fr(err.message, err.data || err, false, err));
  }
};
