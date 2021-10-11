"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
exports.default = () => {
    return [
        express_validator_1.body("email")
            .isEmail()
            .withMessage("Please enter a valid email address")
            .normalizeEmail(),
    ];
};
