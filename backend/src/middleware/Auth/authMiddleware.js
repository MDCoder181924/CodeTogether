import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    try {
        let token = req.cookies?.accessToken;

        // Fallback to Authorization Header if cookie is missing or blocked by browser in cross-origin deployment
        if (!token && req.headers.authorization) {
            if (req.headers.authorization.startsWith("Bearer ")) {
                token = req.headers.authorization.split(" ")[1];
            } else {
                token = req.headers.authorization;
            }
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Token missing",
            });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: Invalid or expired token",
        });
    }
};

export default authMiddleware;