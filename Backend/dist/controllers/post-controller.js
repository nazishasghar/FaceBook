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
exports.commentOnPost = exports.removeLikeOnPost = exports.sendLikeOnPost = exports.getAllPost = exports.deletePost = exports.getPostById = exports.createPost = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Post_1 = require("../Models/Post");
const CustomError_1 = require("../Models/CustomError");
const User_1 = require("../Models/User");
const uuid_1 = require("uuid");
const Posts = mongoose_1.default.model("Post", Post_1.postSchema, "posts");
const Users = mongoose_1.default.model("User", User_1.userSchema, "users");
const createPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { Caption, Likes, User, ProfilePic } = req.body;
    let file = req.file;
    if (!file) {
        return next(new CustomError_1.HttpError(404, 'No profile'));
    }
    const createdPost = new Posts({
        id: (0, uuid_1.v4)(),
        ImageUrl: file === null || file === void 0 ? void 0 : file.filename,
        Caption,
        Likes,
        LikedBy: [],
        Comments: [],
        ProfilePic,
        User,
    });
    let user;
    try {
        user = yield Users.findById(User);
        console.log(user);
    }
    catch (err) {
        console.log(err);
        return next(new CustomError_1.HttpError(404, "Creating Post failed"));
    }
    if (!user) {
        return next(new CustomError_1.HttpError(404, "User not available"));
    }
    try {
        const sess = yield mongoose_1.default.startSession();
        sess.startTransaction();
        yield createdPost.save({ session: sess });
        user.Post.unshift(createdPost);
        yield user.save({ session: sess });
        yield sess.commitTransaction();
    }
    catch (err) {
        console.log(err);
        return next(new CustomError_1.HttpError(404, "Cannot create post"));
    }
    res.json({ createdPost: createdPost });
});
exports.createPost = createPost;
const getPostById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.pid;
    let post;
    try {
        post = yield Posts.findById(postId);
    }
    catch (err) {
        return next(new CustomError_1.HttpError(404, "Something went wrong"));
    }
    if (!post) {
        return next(new CustomError_1.HttpError(404, "Cant find post"));
    }
    res.json({ post: post });
});
exports.getPostById = getPostById;
const deletePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.pid;
    let post;
    try {
        post = yield Posts.findOne({ id: postId }).populate("User");
    }
    catch (err) {
        return next(new CustomError_1.HttpError(404, "Something went wrong"));
    }
    if (!post) {
        return next(new CustomError_1.HttpError(404, "Cant find post"));
    }
    try {
        const sess = yield mongoose_1.default.startSession();
        sess.startTransaction();
        yield post.remove({ session: sess });
        post.User.Post.pull(post);
        yield post.User.save({ session: sess });
        yield sess.commitTransaction();
    }
    catch (err) {
        console.log(err);
        return next(new CustomError_1.HttpError(404, "Cant delete user"));
    }
    res.json({ post: post });
});
exports.deletePost = deletePost;
const getAllPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let posts;
    try {
        posts = yield Posts.find({});
    }
    catch (_a) {
        return next(new CustomError_1.HttpError(500, "No post avaiable"));
    }
    res.json({ posts: posts });
});
exports.getAllPost = getAllPost;
const sendLikeOnPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.pid;
    const { userId } = req.body;
    let post;
    let isAlreadyLiked;
    try {
        post = yield Posts.findOne({ id: postId });
    }
    catch (err) {
        return next(new CustomError_1.HttpError(404, "Could not find post"));
    }
    if (!post) {
        return next(new CustomError_1.HttpError(404, "No post available"));
    }
    isAlreadyLiked = post.LikedBy.find((item) => item === userId);
    try {
        if (!isAlreadyLiked) {
            post.Likes = String(Number(post.Likes) + 1);
            post.LikedBy.push(userId);
            yield post.save();
        }
    }
    catch (_b) {
        return next(new CustomError_1.HttpError(404, "Something went wrong"));
    }
    res.json({ message: "Like Sent" });
});
exports.sendLikeOnPost = sendLikeOnPost;
const removeLikeOnPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.pid;
    const { userId } = req.body;
    let post;
    let isAlreadyDisLiked;
    try {
        post = yield Posts.findOne({ id: postId });
    }
    catch (err) {
        return next(new CustomError_1.HttpError(404, "Could not find post"));
    }
    if (!post) {
        return next(new CustomError_1.HttpError(404, "No post available"));
    }
    try {
        post.LikedBy = post.LikedBy.filter((item) => item !== userId);
        console.log(post.LikedBy);
        post.Likes = String(Number(post.Likes) - 1);
        yield post.save();
    }
    catch (_c) {
        return next(new CustomError_1.HttpError(404, "Something went wrong"));
    }
    res.json({ message: "disLike Sent" });
});
exports.removeLikeOnPost = removeLikeOnPost;
const commentOnPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.pid;
    const { Comment } = req.body;
    let post;
    try {
        post = yield Posts.findOne({ id: postId });
    }
    catch (_d) {
        return next(new CustomError_1.HttpError(401, "No post found from provided Id"));
    }
    if (!post) {
        return next(new CustomError_1.HttpError(401, "No post found from provided Id"));
    }
    try {
        post.Comments.push(Comment);
        yield post.save();
    }
    catch (_e) {
        return next(new CustomError_1.HttpError(401, "Cannot push"));
    }
    res.json({ Comment });
});
exports.commentOnPost = commentOnPost;
