import supabase from "../../lib/supabase.js";
import { compare, hash } from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

export const LoginUser = async (body) =>
{
    const { email, password } = body;

    if (!email || !password) {
        return {
            success: false,
            error: "input field is empty",
            status: 400
        }
    }

    const { data: verifyUser, error: verifyUserError } = await supabase
    .from("fashion_design_users")
    .select("*")
    .eq("email", email)

    if (verifyUserError) throw verifyUserError

    const user = verifyUser[0];

    if (!user) {
        return {
            success: false,
            error: "user not found",
            status: 404
        }
    }

    const matchPassword = await compare(password, user.password);

    if (!matchPassword) {
        return {
            success: false,
            message: "invalid credentials",
            status: 401
        }
    }

    return {
        success: true,
        message: "login success",
        status: 200,
        user: user
    }
}

export const CreateUser = async (body) =>
{
    const { firstname, lastname, email, role, password } = body;

    if (!firstname || !lastname || !email || !role || !password) {
        return {
            success: false,
            error: "input field is empty",
            status: 400
        }
    }

    const { data: existingUser, error: existingUserError } = await supabase
    .from("fashion_design_users")
    .select("*")
    .eq("email", email);

    if (existingUserError) throw existingUserError

    if (existingUser.length > 0) {
        return {
            success: "false",
            error: "unable to create account",
            status: 409
        }
    }

    const hashedPassword = await hash(password, 10);

    const { data: user, error: insertUserError } = await supabase
    .from("fashion_design_users")
    .insert({
        firstname: firstname,
        lastname: lastname,
        email: email,
        role: role,
        password: hashedPassword
    })
    .select("*")
    .single();

    if (insertUserError) throw insertUserError

    return {
        success: true,
        message: "account created success",
        user: user,
        status: 201
    }
}

export const forgotPassword = async (body) =>
{
    const { email } = body;

    if (!email) {
        return {
            success: false,
            error: "email field is empty",
            status: 401
        }
    }

    const { data: checkEmail, error: checkEmailError } = await supabase
    .from("fashion_design_users")
    .select("*")
    .eq("email", email)

    if (checkEmailError) throw checkEmailError

    if (checkEmail.length === 0) {
        return {
            success: false,
            error: "invalid credentials",
            status: 404
        }
    }

    const user = checkEmail[0]

    const otpResetToken = jwt.sign(
        {id: user.id,
            email: user.email
        },
        process.env.JWT_SECRET,
        {expiresIn: "1h"}
    )

    const otpExpiry = Date.now() + 15 * 60 * 1000;

    const otp = crypto.randomInt(100000, 999999).toString();

    const hashedOtp = await hash(otp, 10);

    const { error: insertTokenError } = await supabase
    .from("fashion_design_users")
    .update({
        reset_otp: hashedOtp,
        reset_otp_expiry: otpExpiry,
    })
    .eq("id", user.id);

    if (insertTokenError) throw insertTokenError

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password",
      html: `
        <h2>one time password</h2>
        <div>${otp}</div>
      `,
    });
    
    return {
        success: true,
        message: "otp has been sent to your email",
        status: 200,
        token: otpResetToken
    }
}

export const resetPassword = async (body, token) =>
{
    const { password } = body;

    if (!password) {
        return {
            success: false,
            error: "invalid request",
            status: 401
        }
    }

    if (!token) {
        return {
            success: false,
            error: "unathorised request",
            status: 401
        }
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const hashedPassword = await hash(password, 10);

    const { error: updateError } = await supabase
    .from("fashion_design_users")
    .update({
        password: hashedPassword,
        reset_otp: null,
        reset_otp_expiry: null
    })
    .eq("id", decoded.id)
    .eq("email", decoded.email)

    if (updateError) throw updateError

    return {
        success: true,
        message: "password reset successfull",
        status: 200
    }
}

export const verifyOTP = async (body, token) =>
{
    const { otp } = body;

    if (!otp) {
        return {
            success: false,
            error: "invalid request",
            status: 401
        }
    }

    if (!token) {
        return {
            success: false,
            error: "unathorised request",
            status: 401
        }
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { data: user, error: userError } = await supabase
    .from("fashion_design_users")
    .select("*")
    .eq("id", decoded.id)
    .eq("email", decoded.email)

    if (userError) throw userError

    if (user.length === 0) {
        return {
            success: false,
            error: "invalid request",
            status: 404
        }
    }

    if (Date.now() > user[0].reset_otp_expiry) {
        return {
            success: false,
            error: "expired token",
            status: 403
        }
    }

    const matchOtp = await compare(otp, user[0].reset_otp);

    if (!matchOtp) {
        return {
            success: false,
            error: "invalid otp",
            status: 401
        }
    }

    return {
        success: true,
        message: "otp verified successfull",
        status: 200
    }
}

export const resendOtp = async (token) =>
{
    if (!token) {
        return {
            success: false,
            error: "invalid request",
            status: 401
        }
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decoded)

    if (!decoded) return;

    const otpExpiry = Date.now() + 15 * 60 * 1000;

    const otp = crypto.randomInt(100000, 999999).toString();

    const hashedOtp = await hash(otp, 10);

    const { error: insertTokenError } = await supabase
    .from("fashion_design_users")
    .update({
        reset_otp: hashedOtp,
        reset_otp_expiry: otpExpiry,
    })
    .eq("id", decoded.id)
    .eq("email", decoded.email);

    if (insertTokenError) throw insertTokenError

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: decoded.email,
      subject: "Reset Password",
      html: `
        <h2>one time password</h2>
        <div>${otp}</div>
      `,
    });
    
    return {
        success: true,
        message: "otp has been sent",
        status: 200,
    }
}