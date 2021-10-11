import path from "path";
import multer from "multer";

const fileFilter = (req: any, file: any, cb: any) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  )
    cb(null, true);
  else cb(null, false);
};

const profileImageStorage: any = multer.diskStorage({
  destination: (req: any, file, cb) => {
    cb(null, path.join(__dirname, "../", "../public/", "profile"));
  },
  filename: (req, file, cb) => {
    console.log(file.originalname, "<< original name of the file");
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const postsImageStorage: any = multer.diskStorage({
  destination: (req: any, file, cb) => {
    cb(null, path.join(__dirname, "../", "../public/", "posts"));
  },
  filename: (req, file, cb) => {
    console.log(file, "<< original name of the file");
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const profileImageMulter = multer({
  storage: profileImageStorage,
  fileFilter: fileFilter,
});

export const postImageMulter = multer({
  storage: postsImageStorage,
  fileFilter: fileFilter,
});
