import express from 'express';
import { getChatHistory, askAIController } from '../../controllers/Chat/chatController.js';

const router = express.Router();

router.get('/history/:roomCode', getChatHistory);
router.post('/ai', askAIController);

export default router;
