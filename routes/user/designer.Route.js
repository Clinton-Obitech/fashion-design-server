import express from "express";
import { getShopController, SetUpShopController } from "../../controllers/user/designer.Controller.js";
import multer from "multer";
import { verifyUser } from "../../middleware/user/middleware.js";

const upload = multer();

const router = express.Router();

router.post("/setup/shop", upload.single("profilePic"), verifyUser, SetUpShopController);
router.get("/set/up", verifyUser, getShopController);

export default router;