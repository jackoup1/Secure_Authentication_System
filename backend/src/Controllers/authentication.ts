import { Request, Response } from "express";
import prisma from "../prisma";
import argon2 from "argon2"
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy as GitHubStrategy } from 'passport-github';

const secret = process.env.JWT_SECRET as string;

//variable user for date format when logging user login attempt
const options : Intl.DateTimeFormatOptions = {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
};

export async function Login(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401);
            res.json({ message: "User Not found" });
            return;
        }
        const isValidPassword = await argon2.verify(user.password!, password);

        if (!isValidPassword) {
            res.status(400);
            res.json({ message: "Incorrect Password" });
            return;
        }
        //creating the token with data of username and id of the user expires in 24h
        const token = jwt.sign({ username: user.username, id: user.id }, secret, { expiresIn: "24h" });
        res.json({ token });

        console.log(`user: ${user.username} just logged in at: ${new Date().toLocaleString('en-US', options)}`);
        
        await prisma.loginLog.create({data:{userId:user.id}});
        return;
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server error please try again later" });
        return;
    }
}


export async function SignUp(req: Request, res: Response) {
    const { email, username, password } = req.body;

    try {
        //check if eamil already exists
        const existingUser = await prisma.user.findFirst({
            where: {
              OR: [
                { email },
                { username }
              ]
            }
          });
          
          if (existingUser) {
            if (existingUser.email === email) {
               res.status(400).json({ message: "Email already exists" });
               return
            }
            if (existingUser.username === username) {
               res.status(400).json({ message: "Username already exists" });
               return
            }
          }
          

        //hashing the password and creating the new user 
        const hashedPassword = await argon2.hash(password);

        await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        });

        res.status(201).json({ message: "User Created Successfully" });
        return;
    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: "Internal server error. Please try again later." });
    }

}


export async function Logout(req: Request, res: Response) {
    try {
        // Tell the client to delete their token (if you used cookies)
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        // If using token stored in localStorage, client should delete it manually (frontend side)

        // Optionally set headers to prevent caching old pages
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader('Surrogate-Control', 'no-store');

        res.status(200).json({ message: "Logged out successfully." });
        return;
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
}



// GitHub strategy setup
passport.use(
new GitHubStrategy(
    {
        clientID: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        callbackURL: "http://localhost:5000/api/auth/github/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            const existingUser = await prisma.user.findUnique({
                where: { githubId: profile.id }
            });

            if (existingUser) {
                return done(null, existingUser);
            }
            console.log(profile);
            const user = await prisma.user.create({
                data: {
                    username: profile.username || profile.displayName,
                    email: profile.emails?.[0].value || `${profile.username}@github.com`, // fallback
                    githubId: profile.id
                }
            });

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
)
);

// GitHub callback controller
export function githubCallback(req: Request, res: Response) {
    const user = req.user as any;

    const token = jwt.sign(
        { id: user.id, username: user.username },
        secret,
        { expiresIn: "24h" }
    );

    res.redirect(`http://localhost:3000/auth?token=${token}`);
}
