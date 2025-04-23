import Jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import globalClient from '../prismaClient';
import { RoleType } from "../Models/generated/zod";




const verifyToken = (roles?: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ status: 401, message: "Access Denied: Unauthenticated" });
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
        req.params.userEmail = decoded.userEmail;
        req.params.userName = decoded.userName;
        req.params.userPhone = decoded.userPhone;

        if (roles && roles.length && !roles.includes(req.params.userRole as RoleType)) {
            res.status(401).json({ message: 'Access Denied: Unauthorized' });
            return;
        }
        next();
    } catch (err) {
        if (err instanceof Jwt.JsonWebTokenError) {
            res.status(401).json({ status: 401, message: "Access Denied: Invalid token!" });
        }
        else {
            res.status(500).json({ status: 500, message: "Internal Server Error" });
        }
    }
}

export default verifyToken;