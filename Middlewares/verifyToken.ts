import Jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import globalClient from '../prismaClient';



const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ status: 401, message: "Access Denied: Unauthorized" });
        return;
    }

    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
        res.status(500).json({ status: 500, message: "Internal Server Error: API key not configured" });
        return;
    }

    try {
        const decoded = Jwt.verify(token, JWT_SECRET) as Jwt.JwtPayload;

        req.params.userId = decoded.userId;
        req.params.userRole = decoded.userRole;

        next();
    } catch (err) {
        if (err instanceof Jwt.JsonWebTokenError) {
            res.status(401).json({ status: 401, message: "Access Denied: Invalid token!" });
        }
        res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
}

export default verifyToken;