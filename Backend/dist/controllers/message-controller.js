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
exports.getMessagesForUser = exports.sendMessage = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CustomError_1 = require("../Models/CustomError");
const User_1 = require("../Models/User");
const Users = mongoose_1.default.model("User", User_1.userSchema);
const sendMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { SentBy, SentTo, Content } = req.body;
    const createdMessage = { SentTo, SentBy, Content };
    console.log(createdMessage);
    let sentBy, sentTo;
    try {
        sentBy = yield Users.findById(SentBy);
        sentTo = yield Users.findById(SentTo);
    }
    catch (_a) {
        return next(new CustomError_1.HttpError(401, "Cannot send message"));
    }
    if (!sentBy || !sentTo) {
        return next(new CustomError_1.HttpError(401, "Cannot send"));
    }
    try {
        sentBy.Messages.push(createdMessage);
        sentTo.Messages.push(createdMessage);
        yield sentBy.save();
        yield sentTo.save();
    }
    catch (_b) {
        return next(new CustomError_1.HttpError(401, "Cannot send"));
    }
    res.json({ createdMessage, message: "Message created" });
});
exports.sendMessage = sendMessage;
const getMessagesForUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    let user;
    try {
        user = yield Users.findById(userId);
    }
    catch (_c) {
        return next(new CustomError_1.HttpError(401, "Cant find user"));
    }
    if (!user) {
        return next(new CustomError_1.HttpError(401, "No user found"));
    }
    const messages = user.Messages;
    res.json({ messages });
});
exports.getMessagesForUser = getMessagesForUser;
