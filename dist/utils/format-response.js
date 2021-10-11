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
Object.defineProperty(exports, "__esModule", { value: true });
const CONSTANTS = __importStar(require("../constants"));
const { RESPONSES } = CONSTANTS;
exports.default = (message, data, isWarning = false, error = false, statusCode = 200) => {
    console.log(data);
    const code = !!error && error.statusCode ? error.statusCode : statusCode;
    if (!!error && error.statusCode)
        delete error.statusCode;
    return {
        success: !error ? true : false,
        error: !!error,
        isWarning,
        statusCode: code,
        message: message ||
            (error && process.env.NODE_ENV === "production"
                ? RESPONSES.COMMON_500
                : error
                    ? error.message || RESPONSES.COMMON_500
                    : "Success"),
        data,
    };
};
