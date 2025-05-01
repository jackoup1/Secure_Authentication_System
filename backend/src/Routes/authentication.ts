import { Router } from "express"
import { Login, SignUp, githubCallback , Logout } from "../Controllers/authentication";
import passport from "passport";


const router = Router();

router.post("/login",Login);

router.post("/signUp",SignUp);

router.post("/logout",Logout);

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get(
    "/github/callback",
    passport.authenticate("github", { session: false }),
    githubCallback
);

export default router;