"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
exports.default = () => {
    return [
        express_validator_1.body("email")
            .trim()
            .not()
            .isEmpty()
            .withMessage("Please enter a valid email address"),
        express_validator_1.body("password")
            .trim()
            .not()
            .isEmpty()
            .withMessage("Please enter a valid password"),
    ];
};
