"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_result_1 = __importDefault(require("../../utils/validator-result"));
const AccountRequest_1 = __importStar(require("./../../models/AccountRequest"));
const format_response_1 = __importDefault(require("./../../utils/format-response"));
const mongoose_1 = __importDefault(require("mongoose"));
const ObjectId = mongoose_1.default.Types.ObjectId;
// POST /api/v1/auth/verify-reset-password-request
exports.default = async (req, res, next) => {
    try {
        //validation check
        const isValid = await validator_result_1.default(req, "Invalid Parameters", 422);
        if (!isValid) {
            return;
        }
        const { reqId, token, } = req.body;
        console.log(req.body);
        const requestType = AccountRequest_1.REQUEST_TYPE["reset-password"];
        console.log({ requestType: requestType, token: token, reqId: reqId });
        const request = await AccountRequest_1.default.findOne({
            requestType: requestType,
            token: token,
            _id: ObjectId(reqId),
            "control.isCompleted": false,
            "control.isBlocked": false,
        });
        if (!request) {
            throw { statusCode: 400, err: "Link Expired or Invalid Reuqest" };
        }
        return res.status(200).json(format_response_1.default("Request is valid", {}));
    }
    catch (err) {
        console.log("error", err);
        if (!err.statusCode)
            err.statusCode = 500;
        next(format_response_1.default(err.message, err.data || err, false, err));
    }
};
