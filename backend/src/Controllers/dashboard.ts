import { Request, request, Response,  } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma";
const JWT_SECRET = process.env.JWT_SECRET as string;
export async function getLogActivity(req:Request, res: Response){
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
           res.status(401).json({ message: 'Authorization token missing or malformed' });
           return
        }
    
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
        const userId = Number(decoded.userId) ;
        
        const logActivity = await prisma.loginLog.findMany({
            where: { userId:userId },
            orderBy: {
                loginTime: 'desc'
            }
        });

        // Transform the data to include userAgent
        const transformedData = logActivity.map(log => ({
            ...log,
            userAgent: req.headers['user-agent'] || 'Unknown'
        }));

        res.json(transformedData);
        return;
    }
    
    catch(err){
        console.error(err);
        res.status(500).json({ message: "Internal Server error please try again later" });
        return;
    }
}