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
exports.ALLOWED_REQUEST_TYPE = exports.REQUEST_TYPE = void 0;
const mongoose_1 = __importStar(require("mongoose"));
exports.REQUEST_TYPE = {
    "reset-password": "reset-password",
    "verify-email": "verify-email",
    "verify-account": "verify-account",
    "verify-phone": "verify-phone",
};
exports.ALLOWED_REQUEST_TYPE = [
    exports.REQUEST_TYPE["reset-password"],
    exports.REQUEST_TYPE["verify-email"],
    exports.REQUEST_TYPE["verify-account"],
    exports.REQUEST_TYPE["verify-phone"],
];
const accountRequestSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true,
    },
    requestType: {
        type: String,
        required: true,
        enum: exports.ALLOWED_REQUEST_TYPE,
    },
    token: {
        type: String,
        required: true,
        unique: true,
    },
    control: {
        isBlocked: {
            type: Boolean,
            required: true,
            default: false,
        },
        isCompleted: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
}, {
    timestamps: true,
});
const AccountRequest = mongoose_1.default.model("AccountRequest", accountRequestSchema);
exports.default = AccountRequest;
