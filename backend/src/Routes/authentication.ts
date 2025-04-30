import { Router } from "express"
import { Login, SignUp } from "../Controllers/authentication";

const router = Router();

router.post("/login",Login);

router.post("/signUp",SignUp);

export default router;