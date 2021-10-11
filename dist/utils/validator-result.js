"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
exports.default = (req, message, code) => {
    return new Promise((resolve, reject) => {
        const errors = express_validator_1.validationResult(req);
        if (errors.isEmpty()) {
            return resolve(true);
        }
        const error = new Error(message);
        error.statusCode = code;
        error.data = errors;
        return reject(error);
    });
};
