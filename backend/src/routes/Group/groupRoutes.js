import express from 'express';
import authMiddleware from '../../middleware/Auth/authMiddleware.js';
import { createGroup, joinGroup, getUserGroups, deleteGroup } from '../../controllers/Group/groupController.js';

const router = express.Router();

router.post('/create', authMiddleware, createGroup);
router.post('/join', authMiddleware, joinGroup);
router.get('/my-groups', authMiddleware, getUserGroups);
router.delete('/delete/:groupCode', authMiddleware, deleteGroup);

export default router;