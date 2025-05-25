import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });

const Authenticated = async (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated, token missing"
            });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                success: false,
                message: "JWT secret not defined"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.id = decoded.id; 
        next();

    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

export default Authenticated;
