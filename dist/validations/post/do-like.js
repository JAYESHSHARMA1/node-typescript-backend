"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
exports.default = () => {
    return [
        express_validator_1.param("postId")
            .trim()
            .not()
            .isEmpty()
            .withMessage("Please provide a valid postId"),
    ];
};
