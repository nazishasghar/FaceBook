"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageSchema = void 0;
const mongodb_1 = require("mongodb");
const mongoose_1 = __importDefault(require("mongoose"));
exports.MessageSchema = new mongoose_1.default.Schema({
    Content: { type: String },
    Date: { type: Date },
    SentBy: { type: mongodb_1.ObjectId, ref: 'User' },
    SentTo: { type: mongodb_1.ObjectId }
});
