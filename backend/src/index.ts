import express from "express"
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';
import authRouter from "./Routes/authentication";

dotenv.config();

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(passport.initialize());


app.use("/api/auth",authRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server is running on Port ${PORT}`);
})
