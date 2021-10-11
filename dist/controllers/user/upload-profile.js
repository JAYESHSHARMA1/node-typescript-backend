"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// POST / - uploadProfile
exports.default = (req, res, next) => {
    try {
        const { image } = req.files;
    }
    catch (error) {
        console.log(error);
    }
};
