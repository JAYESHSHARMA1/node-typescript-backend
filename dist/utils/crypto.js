"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genCrypto = void 0;
const crypto_1 = __importDefault(require("crypto"));
const genCrypto = () => {
    return new Promise((resolve, reject) => {
        crypto_1.default.randomBytes(32, (err, buffer) => {
            if (err)
                return reject(err);
            const token = buffer.toString("hex");
            return resolve(token);
        });
    });
};
exports.genCrypto = genCrypto;
