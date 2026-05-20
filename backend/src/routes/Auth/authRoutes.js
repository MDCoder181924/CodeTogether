import express from 'express';
import { generateAccessToken, generateRefreshToken } from '../../services/Auth/sessionService.js';
import { registerUser, LoginUser, LogoutUser, refreshAccessToken } from '../../controllers/Auth/authController.js';
import passport from 'passport';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', LoginUser);
router.post('/logout', LogoutUser);
router.post('/refresh-token', refreshAccessToken);

router.get(`/google`, passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(`/google/callback`, passport.authenticate("google", { session: false }), (req, res) => {
    const accesstoken = generateAccessToken(req.user);

    const refreshtoken = generateRefreshToken(req.user);

    res.cookie("accessToken", accesstoken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
    });

    res.cookie("refreshToken", refreshtoken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
    });

    res.redirect(
        process.env.CLIENT_URL
    );
}
);


router.get(`/github`, passport.authenticate("github", { scope: ["user:email"] }));
router.get('/github/callback', passport.authenticate("github", { session: false }), async (req, res) => {
    const accesstoken = generateAccessToken(req.user);
    const refreshtoken = generateRefreshToken(req.user);

    res.cookie("accessToken", accesstoken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
    });
    res.cookie("refreshToken", refreshtoken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
    });
    res.redirect(
        process.env.CLIENT_URL
    );
});

export default router;