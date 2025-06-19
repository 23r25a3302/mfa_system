import express, { json, urlencoded } from "express";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./config/dbConnect.js";
import authRoutes from "./routes/authRoutes.js";
import "./config/passportConfig.js";

dotenv.config();
dbConnect();

const app= express();

// middleware
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    // origin : ["http://localhost:3001"],
    credentials: true,
};
app.use(cors(corsOptions));
app.use(json({limit: "200mb"}));
app.use(urlencoded({limit: "200mb", extended: true}));

app.use(json());
app.use(urlencoded({extended: true}));

app.use(
    session({
        secret: process.env.SESSION_SECRET || "secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 60000 * 60,
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());

// welcome msg
// app.get("/", (req, res) => {
//     res.json("Server Deployed");
// }

// routes
app.use("/api/auth", authRoutes);

// listening port
const PORT = process.env.PORT || 7002;
app.listen(PORT, () => {
    console.log(`listing to port ${PORT}`);
});
