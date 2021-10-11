import crypto from "crypto";

export const genCrypto = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(32, (err, buffer) => {
      if (err) return reject(err);
      const token = buffer.toString("hex");
      return resolve(token);
    });
  });
};
