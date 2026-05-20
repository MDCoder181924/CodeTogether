import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';

import userRouter from './routes/User/userRoutes.js';

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));


app.user("/api/user" , userRouter);


app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to CodeTogether API"
    })
});

export default app;