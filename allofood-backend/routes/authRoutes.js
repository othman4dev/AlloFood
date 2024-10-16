const authController = require("../controllers/AuthController");
const tokenMiddleware = require("../middlewares/tokenMiddleware");

const express = require("express");
const router = express.Router();

const rateLimit = require('express-rate-limit');

const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    handler: (req, res) => {
        res.status(429).json({
            error: "Too many OTP requests from this IP, please try again later."
        });
    }
});

router.post("/register", authController.register);
router.get("/activate", authController.activate);
router.post("/login", otpLimiter, authController.login);
router.post("/send-otp", otpLimiter, authController.sendOtp);
router.post("/verify-otp", otpLimiter, authController.verifyOtp);
router.post("/forgot-password", otpLimiter, authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);
router.get("/me", tokenMiddleware, authController.me);
router.post("/logout", authController.logout);

module.exports = router;