import { Router } from "express";
import { logout, userLogin, userRegister } from "../controllers/auth.controller.js";
import { VerifyToken } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(userRegister);
router.route("/login").post(userLogin);
router.route("/logout").get(VerifyToken, logout);
export default router;
