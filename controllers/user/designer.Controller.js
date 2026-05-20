import { getShop } from "../../lib/user.js";
import { setUpShop } from "../../service/user/designer.service.js";

export const SetUpShopController =
async (req, res) => {
    try {
        const result = await setUpShop(req.body, req.file, req.userId);
        
        if (!result.success) {
            return res.status(result.status).json({
                success: false,
                error: result.error
            })
        }
        return res.status(result.status).json({
            success: true,
            message: result.message
        });

    } catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            error: "failed to set shop, try again"
        })
    }
}

export const getShopController =
async (req, res) => {
    try {
        const result = await getShop(req.userId);
    
        return res.status(200).json({
            designer: result
        });

    } catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            error: "failed to get shop, try again"
        })
    }
}