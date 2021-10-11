import jwt from "jsonwebtoken";

export const signToken = (user: any) => {
  return new Promise((resolve, reject) => {
    try {
      const token = jwt.sign(
        {
          email: user.email,
          uid: user._id,
        },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "30d",
          algorithm: "HS256",
        }
      );
      return resolve(token);
    } catch (err) {
      reject(err);
    }
  });
};
