import express from 'express';

import authMiddleware from '../../middlewares/Auth/authMiddleware.js';

const router = express.Router();

router.get('/profile' , authMiddleware , (req , res)=>{
    res.status(200).json({
        success:true,
        message:"User profile accessed",
        user: req.user,
    })
})

export default router;