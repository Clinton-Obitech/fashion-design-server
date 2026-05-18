import express from "express";
import { verifyUser } from "../../middleware/user/middleware.js";
import { CreateUserController, ForgotPasswordController, LoginUserController, LogoutUserController, ResendOTPController, ResetPasswordController, VerifyOTPController } from "../../controllers/user/auth.Controller.js";

const router = express.Router();

router.post("/create/user", CreateUserController);
router.post("/login/user", LoginUserController);
router.post("/logout/user", verifyUser, LogoutUserController);
router.post("/forgot/password", ForgotPasswordController);
router.post("/reset/password", ResetPasswordController);
router.post("/verify/otp", VerifyOTPController);
router.post("/resend/otp", ResendOTPController);

export default router;