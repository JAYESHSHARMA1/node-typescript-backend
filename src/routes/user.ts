import { Router } from "express";
const router = Router();

//import file uploader
import { profileImageMulter } from "./../utils/multer";

import userController from "./../controllers/user/index";

// //profile image uploader
router
  .route("/profile")
  .post(profileImageMulter.single("image"), userController.uploadProfile);

export default router;
