"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signToken = (user) => {
    return new Promise((resolve, reject) => {
        try {
            const token = jsonwebtoken_1.default.sign({
                email: user.email,
                uid: user._id,
            }, process.env.JWT_SECRET, {
                expiresIn: "30d",
                algorithm: "HS256",
            });
            return resolve(token);
        }
        catch (err) {
            reject(err);
        }
    });
};
exports.signToken = signToken;
