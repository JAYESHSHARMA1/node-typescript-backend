"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_user_1 = __importDefault(require("./create-user"));
const upload_profile_1 = __importDefault(require("./upload-profile"));
exports.default = {
    createUser: create_user_1.default,
    uploadProfile: upload_profile_1.default,
};
