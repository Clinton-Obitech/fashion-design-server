import express from "express";
import { verifyUser } from "../../middleware/user/middleware.js";
import { CreateUserController, LoginUserController, LogoutUserController } from "../../controllers/user/auth.Controller.js";

const router = express.Router();

router.post("/create/user", CreateUserController);
router.post("/login/user", LoginUserController);
router.post("/logout/user", verifyUser, LogoutUserController);

export default router;