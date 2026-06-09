import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';

import userRouter from './routes/User/userRoutes.js';
import passport from './config/passport.js';
import authRouter from './routes/Auth/authRoutes.js';
import groupRouter from './routes/Group/groupRoutes.js'
import codeRoutes from './routes/Code/codeRoutes.js'

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

const rawClientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
const clientOrigin = rawClientUrl.replace(/\/$/, '');

app.use(cors({
    origin: clientOrigin,
    credentials: true,
}));


app.use("/api/user" , userRouter);

app.use("/api/auth", authRouter);

app.use("/api/group" , groupRouter)

app.use('/api/code',codeRoutes)

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to CodeTogether API"
    })
});

export default app;