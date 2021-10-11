"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.default = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        const error = new Error("Not Authenticated.");
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(" ")[1];
    let decodeToken;
    if (!token) {
        const error = new Error("Not Authenticated.");
        error.statusCode = 401;
        throw error;
    }
    try {
        decodeToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    }
    catch (err) {
        err.statusCode = 500;
        throw err;
    }
    if (!decodeToken) {
        const error = new Error("Not Authenticated.");
        error.statusCode = 401;
        throw error;
    }
    req.userId = decodeToken.uid;
    next();
};
