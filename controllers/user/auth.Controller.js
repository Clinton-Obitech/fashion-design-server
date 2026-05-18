import { CreateUser, forgotPassword, LoginUser, resendOtp, resetPassword, verifyOTP } from "../../service/user/auth.service.js";
import jwt from "jsonwebtoken";

export const LoginUserController =
async (req, res) =>
{
    try {
        const result = await LoginUser(req.body);

        if (!result.success) {
            res.status(result.status).json({
                success: result.success,
                error: result.error
            })
        } else {
            const userToken = jwt.sign(
                {id: result.user.id},
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
                {id: result.user.id},
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

export const ForgotPasswordController =
async (req, res) =>
{
    try {
        const result = await forgotPassword(req.body);
        if (!result.success) {
            res.status(result.status).json({
                success: result.success,
                error: result.error
            })
        } else {
            res.cookie("otpResetToken", result?.token);

            return res.status(result.status).json({
                success: result.success,
                message: result.message,
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

export const ResetPasswordController =
async (req, res) =>
{
    try {
        const token = req.cookies.otpResetToken;

        const result = await resetPassword(req.body, token);
        if (!result.success) {
            res.status(result.status).json({
                success: result.success,
                error: result.error
            })
        } else {
            res.clearCookie("otpResetToken")
            return res.status(result.status).json({
                success: result.success,
                message: result.message,
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

export const VerifyOTPController =
async (req, res) =>
{
    try {
        const token = req.cookies.otpResetToken;

        const result = await verifyOTP(req.body, token);
        if (!result.success) {
            res.status(result.status).json({
                success: result.success,
                error: result.error
            })
        } else {
            
            return res.status(result.status).json({
                success: result.success,
                message: result.message,
            })
        }
    } catch (err) {
        console.error(err);
        return res.status(400).json({
            success: false,
            error: "expired otp"
        })
    }
}

export const ResendOTPController =
async (req, res) =>
{
    try {
        const token = req.cookies.otpResetToken;

        const result = await resendOtp(token);
        if (!result.success) {
            res.status(result.status).json({
                success: result.success,
                error: result.error
            })
        } else {
            
            return res.status(result.status).json({
                success: result.success,
                message: result.message,
            })
        }
    } catch (err) {
        console.error(err);
        return res.status(400).json({
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