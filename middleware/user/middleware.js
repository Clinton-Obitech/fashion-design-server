import jwt from "jsonwebtoken";

export const verifyUser = (req, res, next) =>
{
    const token = req.cookies.userToken;
    try {
        if (!token) {
            return res.status(401).json({
            success: false,
            error: "Unauthorised"
        })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;

        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({
            success: false,
            error: "Unauthorised"
        })
    }
}