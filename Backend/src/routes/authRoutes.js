import express from "express";
import passport from "passport";
import { register, login, logout, authStatus, setup2FA, verify2FA, reset2FA } from "../controllers/authController.js";


const router = express.Router();

// registration 
router.post("/register", register);

// login route
router.post("/login", passport.authenticate("local", {
    failureMessage: true,
    }), login
);

// auth status route
router.get("/status", authStatus);

// logout route
router.post("/logout", logout);

// 2fa route
router.post("/2fa/setup", (req, res, next) => {
    if(req.isAuthenticated()) return next();
    res.status(401).json({message: "Unauthorized"});
    }, setup2FA
);

// verify route
router.post("/2fa/verify", (req, res, next) => {
    if(req.isAuthenticated()) return next();
    res.status(401).json({message: "Unauthorized"});
    }, verify2FA);

// reset route
router.post("/2fa/reset", (req, res, next) => {
    if(req.isAuthenticated()) return next();
    res.status(401).json({message: "Unauthorized"});
    }, reset2FA);

// security qa
// router.post("/security/verify", (req, res, next) => {
//     if (req.isAuthenticated()) return next();
//     res.status(401).json({ message: "Unauthorized" });
// }, verifySecurityAnswer);

export default router;