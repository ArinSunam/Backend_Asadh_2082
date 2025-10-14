import { Router } from "express";
import {
  logout,
  updateProfilePic,
  userLogin,
  userRegister,
} from "../controllers/auth.controller.js";
import { VerifyToken } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { registerValidationSchema } from "../configs/validationSchema.js";
import { validateRequest } from "../middleware/validation.middleware.js";

const router = Router();

router.route("/register").post(validateRequest(registerValidationSchema), userRegister);
router.route("/login").post(userLogin);
router.route("/logout").get(VerifyToken, logout);
router.route("/profile_pic").patch(VerifyToken, upload.single("profile_pic"), updateProfilePic);
export default router;
