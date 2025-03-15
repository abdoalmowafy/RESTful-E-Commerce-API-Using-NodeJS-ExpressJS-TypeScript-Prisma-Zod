import { RoleType } from "../Models/generated/zod";
import { Request, Response, NextFunction } from "express";

const authorize = (roles: RoleType[]) => (req: Request, res: Response, next: NextFunction) => {
    if (roles.length && !roles.includes(req.params.userRole as RoleType)) {
        res.status(403).json({ message: 'Unauthorized' });
    }
    next();
}

export default authorize;
