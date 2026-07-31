import express from 'express';
import authMiddleware from '../../middleware/Auth/authMiddleware.js';
import { createGroup, joinGroup, getUserGroups, deleteGroup } from '../../controllers/Group/groupController.js';
import { getFiles, createFile, updateFile, deleteFile } from '../../controllers/Group/fileController.js';

const router = express.Router();

router.post('/create', authMiddleware, createGroup);
router.post('/join', authMiddleware, joinGroup);
router.get('/my-groups', authMiddleware, getUserGroups);
router.delete('/delete/:groupCode', authMiddleware, deleteGroup);

// File management routes
router.get('/:groupCode/files', authMiddleware, getFiles);
router.post('/:groupCode/files', authMiddleware, createFile);
router.put('/:groupCode/files/:fileId', authMiddleware, updateFile);
router.delete('/:groupCode/files/:fileId', authMiddleware, deleteFile);

export default router;