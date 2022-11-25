"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storySchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.storySchema = new mongoose_1.default.Schema({
    imageUrl: { type: String, required: true },
    creatorName: { type: String, required: false },
    creatorImage: { type: String, required: false },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true, ref: "User" },
});
