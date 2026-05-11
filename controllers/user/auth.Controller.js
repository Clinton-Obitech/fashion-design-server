import { CreateUser, LoginUser } from "../../service/user/auth.service.js";
import jwt from "jsonwebtoken";

export const LoginUserController =
async (req, res) =>
{
    try {
        const result = await LoginUser(req.body);
        console.log(result.user.id)
        if (!result.success) {
            res.status(result.status).json({
                success: result.success,
                error: result.error
            })
        } else {
            const userToken = jwt.sign(
                {id: result?.user?.id},
                process.env.JWT_SECRET,
                {expiresIn: "1d"}
            )
            res.cookie("userToken", userToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
            })
            return res.status(result.status).json({
                success: result.success,
                message: result.message,
                user: result.user
            })
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            error: "server error"
        })
    }
}

export const CreateUserController =
async (req, res) =>
{
    try {
        const result = await CreateUser(req.body);
        if (!result.success) {
            res.status(result.status).json({
                success: result.success,
                error: result.error
            })
        } else {
            const userToken = jwt.sign(
                {id: result?.user?.id},
                process.env.JWT_SECRET,
                {expiresIn: "1d"}
            )
            res.cookie("userToken", userToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
            })
            return res.status(result.status).json({
                success: result.success,
                message: result.message,
                user: result.user
            })
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            error: "server error"
        })
    }
}

export const LogoutUserController = (req, res) =>
{
    try {
        res.clearCookie("userToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
        })
        return res.status(200).json({
            message: "Logged out"
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            error: "server error"
        })
    }
}