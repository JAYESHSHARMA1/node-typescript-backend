"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
exports.default = () => {
    return [
        express_validator_1.body("postType")
            .trim()
            .not()
            .isEmpty()
            .withMessage("Please provide a valid post type"),
        express_validator_1.body("description")
            .trim()
            .not()
            .isEmpty()
            .withMessage("Please provide a valid description"),
        // body("usersTags")
        //   .trim()
        //   .not()
        //   .isEmpty()
        //   .withMessage("Please provide a valid usersTags"),
        express_validator_1.body("hashTags")
            .trim()
            .not()
            .isEmpty()
            .withMessage("Please provide a valid hashTags"),
        // body("location")
        //   .trim()
        //   .not()
        //   .isEmpty()
        //   .withMessage("Please provide a valid location"),
    ];
};
