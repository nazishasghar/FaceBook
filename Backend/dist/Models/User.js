"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.userSchema = new mongoose_1.default.Schema({
    ProfilePic: { type: String, required: false },
    Name: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    Password: { type: String, required: true, minlength: 8, select: false },
    Age: { type: String, required: true },
    Address: { type: String, required: false },
    Pincode: { type: String, required: false },
    MobileNumber: { type: String, required: false },
    Education: { type: Object, required: false },
    Post: [{ type: mongoose_1.default.Types.ObjectId, required: false, ref: "Post" }],
    Stories: [{ type: mongoose_1.default.Types.ObjectId, required: false, ref: "Story" }],
    Messages: [{ type: Object }],
    Friends: [{ type: mongoose_1.default.Types.ObjectId, required: false }],
    Requests: [{ type: mongoose_1.default.Types.ObjectId }],
    RequestSentTo: [{ type: mongoose_1.default.Types.ObjectId, required: false }],
    Hobbies: { type: String, required: false },
    BloodGroup: { type: String, required: false },
    MaritalStatus: { type: String, required: false },
    isOnline: { type: Boolean, required: false },
});
