import supabase from "./supabase.js";

export const getUser = async (userId) => {
    const { data, error } = await supabase
        .from("fashion_design_users")
        .select("firstname, lastname, email, role")
        .eq("id", userId)
        .single();

        if (error) throw error

        return data;
}