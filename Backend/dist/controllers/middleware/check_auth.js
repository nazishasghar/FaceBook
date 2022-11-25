"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizationMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const CustomError_1 = require("../../Models/CustomError");
const authorizationMiddleware = (req, res, next) => {
    if (req.method === "OPTIONS") {
        return next();
    }
    if (!req.headers.authorization) {
        return next(new CustomError_1.HttpError(401, "No token"));
    }
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return next(new CustomError_1.HttpError(401, "No token"));
        }
        jsonwebtoken_1.default.verify(token, "specialkey");
        return next();
    }
    catch (err) {
        const error = new CustomError_1.HttpError(401, `Authentication Failed`);
        return next(err);
    }
};
exports.authorizationMiddleware = authorizationMiddleware;
