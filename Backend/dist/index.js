"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const users_routes_1 = require("./routes/users-routes");
const post_routes_1 = require("./routes/post-routes");
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const message_routes_1 = require("./message-routes");
const login_routes_1 = require("./routes/login-routes");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With,Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
    return next();
});
const ErrorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    res
        .status(err.code || 500)
        .json({ message: err.message || "An unknown error has occured" });
};
app.use(ErrorHandler);
app.use("/api/auth", login_routes_1.authRouter);
app.use("/public", express_1.default.static("public"));
app.use("/api/users", users_routes_1.router);
app.use("/api/post", post_routes_1.postRouter);
app.use("/api/messages", message_routes_1.messageRouter);
// Custom Error Handling
mongoose_1.default
    .connect("mongodb+srv://Nazish:sCj4JWBk91a4R5uN@cluster0.pjdokdn.mongodb.net/facebook?retryWrites=true&w=majority")
    .then(() => {
    app.listen(3004, () => {
        console.log(`⚡️[server]: Server is running a https://localhost:3004`);
    });
})
    .catch((err) => {
    console.log(err);
});
