"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentDateTime = void 0;
const currentDateTime = () => {
    return new Date().toUTCString();
};
exports.currentDateTime = currentDateTime;
