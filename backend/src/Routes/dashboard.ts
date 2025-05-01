import { Router } from "express";
import { authorizeUser } from "../Middleware/authorizationMiddleware";
import { getLogActivity } from "../Controllers/dashboard";

const router = Router();

router.get("/",authorizeUser,getLogActivity);

export default router;