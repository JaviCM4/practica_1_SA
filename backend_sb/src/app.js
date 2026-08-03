const express = require("express");
const cors = require("cors");

const sessionMiddleware = require("./config/session");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(sessionMiddleware);

app.use("/api/auth", authRoutes);

module.exports = app;