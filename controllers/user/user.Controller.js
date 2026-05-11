import { getUser } from "../../lib/user.js";

export const getUserController =
async (req, res) =>
{
    try {
        const result = await getUser(req.userId);

        return res.json({user: result.firstname})
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            error: "server error"
        })
    }
}