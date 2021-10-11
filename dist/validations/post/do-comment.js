"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
exports.default = () => {
    return [
        express_validator_1.body("comment")
            .trim()
            .not()
            .isEmpty()
            .withMessage("Please provide a valid comment"),
        express_validator_1.body("isReply").trim().not().isEmpty().withMessage("invalid comment type"),
    ];
};
