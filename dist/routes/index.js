"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
//import auth middleware
const is_auth_1 = __importDefault(require("./../middlewares/is-auth"));
//import user routes
const user_1 = __importDefault(require("./user"));
//import auth routes
const auth_1 = __importDefault(require("./auth"));
//import post routes
const post_1 = __importDefault(require("./post"));
//initialize auth routes
router.use("/auth", auth_1.default);
//initialize user routes
router.use("/user", is_auth_1.default, user_1.default);
//initialize post routes
router.use("/post", is_auth_1.default, post_1.default);
exports.default = router;
