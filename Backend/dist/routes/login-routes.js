"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const login_controller_1 = require("../controllers/login-controller");
const check_auth_1 = require("../controllers/middleware/check_auth");
const post_routes_1 = require("./post-routes");
exports.authRouter = (0, express_1.default)();
exports.authRouter.post("/signup", post_routes_1.imageUpload.single("ProfilePic"), login_controller_1.signUp);
exports.authRouter.post("/login", login_controller_1.login);
exports.authRouter.use(check_auth_1.authorizationMiddleware);
exports.authRouter.post("/logout", login_controller_1.logout);
