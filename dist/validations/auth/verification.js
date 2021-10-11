"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
exports.default = () => {
    return [
        express_validator_1.body("reqId").trim().not().isEmpty().withMessage("Invalid"),
        express_validator_1.body("token").trim().not().isEmpty().withMessage("Invalid"),
    ];
};
