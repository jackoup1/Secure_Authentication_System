import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET as string;


export function authorizeUser(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({ message: "Authorization token missing" });
        return;
    }

    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

    try {
        const user = jwt.verify(token, JWT_SECRET);
        (req as any).user = user;
        next();
    } catch (error) {
         res.status(401).json({ message: "Token invalid or expired. Please login again." });
         return;
    }
}
