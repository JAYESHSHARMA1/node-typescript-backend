import { Router } from "express";
const router = Router();

//import auth middleware
import isAuth from "./../middlewares/is-auth";

//import user routes
import UserRoutes from "./user";
//import auth routes
import AuthRoutes from "./auth";
//import post routes
import PostRoutes from "./post";

//initialize auth routes
router.use("/auth", AuthRoutes);
//initialize user routes
router.use("/user", isAuth, UserRoutes);
//initialize post routes
router.use("/post", isAuth, PostRoutes);

export default router;
