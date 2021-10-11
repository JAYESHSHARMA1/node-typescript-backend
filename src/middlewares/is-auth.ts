import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export default (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error: any = new Error("Not Authenticated.");
    error.statusCode = 401;
    throw error;
  }
  const token: any = authHeader.split(" ")[1];
  let decodeToken: any;

  if (!token) {
    const error: any = new Error("Not Authenticated.");
    error.statusCode = 401;
    throw error;
  }

  try {
    decodeToken = jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodeToken) {
    const error: any = new Error("Not Authenticated.");
    error.statusCode = 401;
    throw error;
  }
  req.userId = decodeToken.uid;
  next();
};
