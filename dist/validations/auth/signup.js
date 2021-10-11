"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const User_1 = __importDefault(require("../../models/User"));
exports.default = () => {
    return [
        express_validator_1.body("email")
            .isEmail()
            .withMessage("Please enter a valid email address")
            .custom((value, { req }) => {
            return User_1.default.findOne({ email: value }).then((user) => {
                if (user) {
                    return Promise.reject("Email with another user already exists!");
                }
            });
        })
            .normalizeEmail(),
        express_validator_1.body("password")
            .trim()
            .isLength({ min: 6 })
            .withMessage("Please enter a valid password"),
        express_validator_1.body("fullName")
            .trim()
            .not()
            .isEmpty()
            .withMessage("Please enter a valid name"),
        express_validator_1.body("userName")
            .trim()
            .isLength({ min: 6 })
            .withMessage("Please enter a valid username")
            .custom((value, { req }) => {
            return User_1.default.findOne({ userName: value }).then((userDoc) => {
                if (userDoc) {
                    return Promise.reject("Username not available!");
                }
            });
        }),
    ];
};
