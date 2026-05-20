import supabase from "../../lib/supabase.js";

export const setUpShop = async (body, file, userId) =>
{
    const { brand, sex, attire } = body;
    
    if (!brand || !sex || !attire) {
        return {
            success: false,
            error: "complete all fields",
            status: 401
        }
    }

    const { data: existingShop, error: existingShopError } = await supabase
    .from("designer_setUp")
    .select("*")
    .eq("user_id", userId)

    if (existingShopError) throw existingShopError

    if (existingShop.length > 0) {
        return {
            success: false,
            error: "shop already exists",
            status: 401
        }
    }

    const fileName = `${Date.now()}-${file.originalname}`;

    const { error: uploadError } = await supabase.storage
        .from("fashion_image")
        .upload(fileName, file.buffer, {
            contentType: file.mimetype,
        });

        if (uploadError) throw uploadError

    const { data } = supabase.storage
        .from("fashion_image")
        .getPublicUrl(fileName)

    const { error: insertError } = await supabase
        .from("designer_setUp")
        .insert(
            {
                brand: brand,
                sex: sex,
                attire: attire,
                profile_pic: data.publicUrl,
                user_id: userId
            }
        );

        if (insertError) throw insertError

    return {
        success: true,
        message: "set up successful",
        status: 201
    }
}