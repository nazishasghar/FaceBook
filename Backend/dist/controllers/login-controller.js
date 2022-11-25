"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.signUp = void 0;
const User_1 = require("../Models/User");
const mongoose_1 = __importDefault(require("mongoose"));
const CustomError_1 = require("../Models/CustomError");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const Users = mongoose_1.default.model("User", User_1.userSchema, "users");
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    bcrypt_1.default
        .hash(req.body.Password, 10)
        .then((hash) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const newUser = new Users({
            ProfilePic: (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename,
            Name: req.body.Name,
            Email: req.body.Email,
            Password: hash,
            Age: req.body.Age,
            Address: req.body.Address,
            Pincode: req.body.Pincode,
            MobileNumber: req.body.MobileNumber,
            Education: JSON.parse(req.body.Education),
            Post: [],
            RequestSentTo: [],
            Stories: [],
            Messages: [],
            Friends: [],
            Requests: [],
            Hobbies: req.body.Hobbies,
            BloodGroup: req.body.BloodGroup,
            MaritalStatus: req.body.MaritalStatus,
            isOnline: false,
        });
        try {
            yield newUser.save();
        }
        catch (err) {
            console.log(err);
            return next(new CustomError_1.HttpError(404, "err"));
        }
        res
            .status(201)
            .json({ user: newUser, userId: newUser.id, email: newUser.Email });
    }))
        .catch((err) => {
        console.log(err);
    });
});
exports.signUp = signUp;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    let existingUser;
    try {
        existingUser = yield Users.findOne({ Email: email }).select("+Password");
        console.log(existingUser);
    }
    catch (_b) {
        return next(new CustomError_1.HttpError(500, "No user"));
    }
    if (!existingUser) {
        return next(new CustomError_1.HttpError(404, "User not there"));
    }
    let isValidPassword = false;
    try {
        isValidPassword = yield bcrypt_1.default.compare(password, existingUser.Password);
    }
    catch (_c) {
        return next(new CustomError_1.HttpError(404, "sign-up failed"));
    }
    if (!isValidPassword) {
        return next(new CustomError_1.HttpError(404, "password is incorrect"));
    }
    let token;
    try {
        existingUser.isOnline = true;
        yield existingUser.save();
        token = jsonwebtoken_1.default.sign({ userId: existingUser.id, email: existingUser.Email }, "specialkey", { expiresIn: "1h" });
    }
    catch (_d) {
        return next(new CustomError_1.HttpError(404, "sign-up failed"));
    }
    res.json({
        message: "Logged in",
        user: existingUser,
        userId: existingUser.id,
        token: token,
        expiresIn: "1h",
    });
});
exports.login = login;
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    let existingUser;
    try {
        existingUser = yield Users.findById(userId);
    }
    catch (_e) {
        return next(new CustomError_1.HttpError(404, "user not found"));
    }
    if (!existingUser) {
        return next(new CustomError_1.HttpError(404, "user not found"));
    }
    existingUser.isOnline = false;
    yield existingUser.save();
    res.json({ message: "Logged out" });
});
exports.logout = logout;
