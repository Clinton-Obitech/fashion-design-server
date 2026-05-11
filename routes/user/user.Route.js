import express from "express";
import { getUserController} from "../../controllers/user/user.Controller.js";
import { verifyUser } from "../../middleware/user/middleware.js";

const router = express.Router();

router.get("/get/user", verifyUser, getUserController);

export default router;