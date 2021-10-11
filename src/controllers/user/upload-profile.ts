import { Request, Response, NextFunction } from "express";

// POST / - uploadProfile
export default (req: any, res: Response, next: NextFunction) => {
  try {
    const { image }: { image: any } = req.files;
  } catch (error) {
    console.log(error);
  }
};
