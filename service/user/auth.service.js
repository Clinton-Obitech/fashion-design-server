import supabase from "../../lib/supabase.js";
import { compare, hash } from "bcrypt";

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