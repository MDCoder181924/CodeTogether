import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import userRouter from './routes/User/userRoutes.js';
import passport from './config/passport.js';
import authRouter from './routes/Auth/authRoutes.js';
import groupRouter from './routes/Group/groupRoutes.js'
import codeRoutes from './routes/Code/codeRoutes.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Resolve frontend built files (checking both 'dist' and 'public' at backend root)
const publicPath = path.join(__dirname, '../public');
const distPath = path.join(__dirname, '../dist');
const staticPath = fs.existsSync(distPath) ? distPath : publicPath;

if (fs.existsSync(staticPath)) {
    app.use(express.static(staticPath));
}

app.use("/api/user" , userRouter);

app.use("/api/auth", authRouter);

app.use("/api/group" , groupRouter)

app.use('/api/code',codeRoutes)

if (fs.existsSync(staticPath)) {
    app.get('*all', (req, res, next) => {
        if (req.path.startsWith('/api')) {
            return next();
        }
        res.sendFile(path.join(staticPath, 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.status(200).json({
            success: true,
            message: "Welcome to CodeTogether API"
        })
    });
}

export default app;