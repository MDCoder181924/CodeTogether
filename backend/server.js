import dotenv from 'dotenv';
dotenv.config();

const { default: app } = await import('./src/app.js');
import http from "http";

import connectDB from './src/config/db.js';
connectDB();

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

server.listen(PORT , ()=> {
    console.log(`Server is running on port http://localhost:${PORT}`);
})