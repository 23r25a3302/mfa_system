import bcrypt from "bcryptjs";
import speakeasy from "speakeasy";
import qrCode from "qrcode";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
export const register = async (req, res) => {
    try {
        // const { username, password, securityAnswer } = req.body;
        // const hashedPassword = await bcrypt.hash(password, 10);
        // // const hashedSecurityAnswer = await bcrypt.hash(securityAnswer, 10);
        // const newUser = new User({
        //     username,
        //     password: hashedPassword,
        //     securityAnswer, //: hashedSecurityAnswer,
        //     isMfaActive: false,
        // });

        const {username, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            password: hashedPassword,
            isMfaActive: false,
        });
        await newUser.save();
        console.log("new user : ", newUser);
        res.status(201).json({message: "user register successfull"});
    } catch (error) {
        res.status(500).json({error: "Error registering user", message: error});
    }
};

export const login = async (req, res) => {
    console.log("the authentication successfull", req.user);
    res.status(200).json({
        message: "user login successfull",
        username: req.user.username,
        isMfaActive: req.user.isMfaActive,
    });
};

export const authStatus = async (req, res) => {
    if(req.user) {
        res.status(200).json({
            message: "user login successfull",
            username: req.user.username,
            isMfaActive: req.user.isMfaActive,
        });
    } else {
        res.status(401).json({message: "UnauthUser"});
    }
};

export const logout = async (req, res) => {
    if(!req.user) res.status(401).json({message: "UnauthUser"});
    // req.logout((err) => {
    //     if(err) return res.status(400).json({message: "user not logged-out"});
    //     res.status(200).json({message: "logout successfull"});
    // });

    // cookie detroy
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.session.destroy((err) => {
            if(err) {
                return next(err);
            }
            res.clearCookie("connect.sid");
            res.status(200).json({message : "Logged out Successfully"});
        });
    });
};

export const setup2FA = async (req, res) => {
    try {
        console.log(("user is", res.user));
        const user = req.user;
        var secret = speakeasy.generateSecret();
        console.log("the secret object is : ", secret);
        user.twoFactorSecret = secret.base32;
        user.isMfaActive = true;
        await user.save();
        const url = speakeasy.otpauthURL({
            secret: secret.base32,
            label: `${req.user.username}`,
            issuer: "www.ram.com",
            encoding: "base32",
        });
        const qrImageUrl = await qrCode.toDataURL(url);
        res.status(200).json({
            secret: secret.base32,
            qrCode: qrImageUrl,
        })
    } catch (error) {
        res.status(500).json({ error : "error setting up 2FA", message: error});
    }
};

export const verify2FA = async (req, res) => {
    const { token } = req.body;
    const user = req.user;

    const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: "base32",
        token,
    });

    if(verified) {
        const jwtToken = jwt.sign(
            { username: user.username},
            process.env.JWT_SECRET,
            { expiresIn: "1hr"}
        );
        res.status(200).json({message: "2FA successfull", token: jwtToken});
    } else {
        res.status(400).json({ message: "Invalid 2FA token"});
    }
};

export const reset2FA = async (req, res) => {
    try {
        const user = req.user;
        user.twoFactorSecret = "";
        user.isMfaActive = false;
        await user.save();
        res.status(200).json({message: "2FA reset successfull"});
    } catch (error) {
        res.status(500).json({error: "Error reseting 2FA", message: error});
    }
};

// // security q&a
// export const verifySecurityAnswer = async (req, res) => {
//     try {
//         const { username, securityAnswer } = req.body;

//         const user = await User.findOne({ username });
//         if (!user) {
//             return res.status(401).json({ message: "User not found" });
//         }

//         // const isMatch = await bcrypt.compare(securityAnswer, user.securityAnswer);
//         const isMatch = securityAnswer === user.securityAnswer;

//         if (isMatch) {
//             const jwtToken = jwt.sign(
//                 { username: user.username },
//                 process.env.JWT_SECRET,
//                 { expiresIn: "1hr" }
//             );
//             res.status(200).json({ message: "Security question verified", token: jwtToken });
//         } else {
//             res.status(401).json({ message: "Incorrect answer to security question" });
//         }
//     } catch (error) {
//         res.status(500).json({ error: "Error verifying security question", message: error.message });
//     }
// };

