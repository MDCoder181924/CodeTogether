import express from 'express';
import authMiddleware from '../../middleware/Auth/authMiddleware.js'
import { createGroup , joinGroup } from '../../controllers/Group/groupController.js';

const router = express.Router();

router.post('/create' , authMiddleware , createGroup);
router.post('/join' , authMiddleware , joinGroup);

export default router;