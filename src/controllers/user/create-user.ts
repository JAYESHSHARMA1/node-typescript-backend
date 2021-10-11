import { Request, Response, NextFunction } from "express";
import io from "../../utils/socket";

// io.getIO().emit("post", {
//   action: "create",
//   post: "post",
// });

// POST /user - createUser
export default (req: Request, res: Response, next: NextFunction) => {
  const user: { email: string; password: string; name: string } = req.body;
  return res.json(user);
};
