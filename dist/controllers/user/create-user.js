"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// io.getIO().emit("post", {
//   action: "create",
//   post: "post",
// });
// POST /user - createUser
exports.default = (req, res, next) => {
    const user = req.body;
    return res.json(user);
};
