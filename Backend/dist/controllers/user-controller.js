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
exports.unfriendUser = exports.getRequestDetail = exports.searchForUser = exports.createStory = exports.getAllFriends = exports.removeRequest = exports.sendRequest = exports.updateUser = exports.addFriend = exports.deleteUser = exports.getAllUser = exports.getUserbyId = exports.getStories = void 0;
const User_1 = require("../Models/User");
const mongoose_1 = __importDefault(require("mongoose"));
const CustomError_1 = require("../Models/CustomError");
const Stories_1 = require("../Models/Stories");
const Post_1 = require("../Models/Post");
const Users = mongoose_1.default.model("User", User_1.userSchema, "users");
const Stories = mongoose_1.default.model("Stories", Stories_1.storySchema, "stories");
const Posts = mongoose_1.default.model("Post", Post_1.postSchema, "posts");
const getStories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let stories;
    try {
        stories = yield Stories.find({});
    }
    catch (err) {
        console.log(err);
        return next(new CustomError_1.HttpError(404, "No Stories found"));
    }
    res.json({ stories });
});
exports.getStories = getStories;
const getUserbyId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.uid;
    let user;
    try {
        user = yield Users.findById(userId);
    }
    catch (_a) {
        const err = new CustomError_1.HttpError(404, "Could not find user with provided id");
        return next(err);
    }
    res.json(user === null || user === void 0 ? void 0 : user.toObject({ getters: true }));
});
exports.getUserbyId = getUserbyId;
const getAllUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let users;
    try {
        users = yield Users.find({});
    }
    catch (_b) {
        return next(new CustomError_1.HttpError(404, "Cant find user"));
    }
    res.json({ users: users.map((user) => user.toObject({ getters: true })) });
});
exports.getAllUser = getAllUser;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userToBeDeletedId = req.params.uid;
    let userToBeDeleted;
    try {
        userToBeDeleted = yield Users.findById(userToBeDeletedId);
    }
    catch (_c) {
        return next(new CustomError_1.HttpError(404, "Cant find user"));
    }
    try {
        yield (userToBeDeleted === null || userToBeDeleted === void 0 ? void 0 : userToBeDeleted.remove());
    }
    catch (_d) {
        return next(new CustomError_1.HttpError(404, "Cant delete user"));
    }
    res.json({ deletedUser: userToBeDeleted === null || userToBeDeleted === void 0 ? void 0 : userToBeDeleted.Name });
});
exports.deleteUser = deleteUser;
const addFriend = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentUserId, addedFriendId } = req.body;
    let currentUser;
    let addedFriend;
    try {
        currentUser = yield Users.findById(currentUserId);
        addedFriend = yield Users.findById(addedFriendId);
    }
    catch (_e) {
        return next(new CustomError_1.HttpError(404, "Something went wrong"));
    }
    if (!currentUser || !addedFriend) {
        return next(new CustomError_1.HttpError(404, "User not found"));
    }
    try {
        currentUser.Friends.push(addedFriendId);
        currentUser.Requests = currentUser.Requests.filter((item) => item === addedFriendId);
        yield currentUser.save();
        addedFriend.Friends.push(currentUserId);
        addedFriend.RequestSentTo = addedFriend.RequestSentTo.filter((item) => item === currentUserId);
        yield addedFriend.save();
    }
    catch (_f) {
        return next(new CustomError_1.HttpError(404, "Something went wrong"));
    }
    res.json({ currentUser, addedFriend, message: "Friend request accepted" });
});
exports.addFriend = addFriend;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, Age, Address, Pincode, Education, Hobbies, BloodGroup, MaritalStatus, } = req.body;
    const updatedProfilePic = req.file;
    let updatedUser;
    let usersPosts;
    try {
        usersPosts = yield Posts.find({ User: userId });
        updatedUser = yield Users.findById(userId);
    }
    catch (_g) {
        return next(new CustomError_1.HttpError(401, "User Not found"));
    }
    if (!updatedProfilePic || !updatedUser) {
        return next(new CustomError_1.HttpError(401, "User Not found"));
    }
    try {
        updatedUser.ProfilePic = updatedProfilePic.filename;
        updatedUser.Age = Age;
        updatedUser.Address = Address;
        updatedUser.Pincode = Pincode;
        updatedUser.Education = JSON.parse(Education);
        updatedUser.Hobbies = Hobbies;
        updatedUser.BloodGroup = BloodGroup;
        updatedUser.MaritalStatus = MaritalStatus;
        usersPosts.forEach((item) => {
            item.ProfilePic = updatedProfilePic.filename;
            item.save();
        });
        yield updatedUser.save();
    }
    catch (err) {
        console.log(err);
    }
    res.json({ updatedUser });
});
exports.updateUser = updateUser;
const sendRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { sendRequestToUserId, getRequestFromUserId } = req.body;
    let sendRequestToUser;
    let getRequestFromUser;
    try {
        sendRequestToUser = yield Users.findById(sendRequestToUserId);
        getRequestFromUser = yield Users.findById(getRequestFromUserId);
    }
    catch (_h) {
        return next(new CustomError_1.HttpError(404, "Something went wrong"));
    }
    if (sendRequestToUser && getRequestFromUser) {
        sendRequestToUser.Requests.push(getRequestFromUserId);
        getRequestFromUser.RequestSentTo.push(sendRequestToUserId);
        yield sendRequestToUser.save();
        yield getRequestFromUser.save();
    }
    else {
        return next(new CustomError_1.HttpError(404, "user not found"));
    }
    res.json({ sendRequestToUser, getRequestFromUser, message: "Request sent" });
});
exports.sendRequest = sendRequest;
const removeRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { removeRequestFromUserId, removeSentRequestFromUserId } = req.body;
    let removeRequestFromUser, removeSentRequestFromUser;
    try {
        removeRequestFromUser = yield Users.findById(removeRequestFromUserId);
        removeSentRequestFromUser = yield Users.findById(removeSentRequestFromUserId);
    }
    catch (err) {
        return next(new CustomError_1.HttpError(401, "No user found"));
    }
    if (!removeRequestFromUser || !removeSentRequestFromUser) {
        return next(new CustomError_1.HttpError(401, "No user found"));
    }
    try {
        removeRequestFromUser.Requests = removeRequestFromUser.Requests.filter((item) => item === removeSentRequestFromUserId);
        removeSentRequestFromUser.RequestSentTo =
            removeSentRequestFromUser.RequestSentTo.filter((item) => item === removeRequestFromUserId);
        yield removeRequestFromUser.save();
        yield removeSentRequestFromUser.save();
    }
    catch (_j) {
        return next(new CustomError_1.HttpError(404, "Cant perform operation"));
    }
    res.json({ removeSentRequestFromUser, message: "Removed Successfully" });
});
exports.removeRequest = removeRequest;
const getAllFriends = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    let existingUser;
    try {
        existingUser = yield Users.findById(userId);
    }
    catch (err) {
        console.log(err);
        return next(new CustomError_1.HttpError(404, `${err}`));
    }
    if (!existingUser) {
        return next(new CustomError_1.HttpError(404, "user not found"));
    }
    const friends = yield Users.find({ _id: { $in: existingUser.Friends } });
    res.json({ friends, message: "friends fetched" });
});
exports.getAllFriends = getAllFriends;
const createStory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    let file = req.file;
    let user;
    let story;
    try {
        user = yield Users.findById(userId);
    }
    catch (_k) {
        return next(new CustomError_1.HttpError(404, "No user found"));
    }
    if (!user) {
        return next(new CustomError_1.HttpError(404, "No user found"));
    }
    if (!file) {
        return next(new CustomError_1.HttpError(404, "Something went wrong"));
    }
    story = new Stories({
        imageUrl: file.filename,
        creatorImage: user.ProfilePic,
        creatorName: user.Name,
        userId: userId,
    });
    try {
        const sess = yield mongoose_1.default.startSession();
        sess.startTransaction();
        yield story.save({ session: sess });
        user.Stories.unshift(story);
        yield user.save({ session: sess });
        yield sess.commitTransaction();
    }
    catch (_l) {
        return next(new CustomError_1.HttpError(404, "Cant add stories"));
    }
    res.json({ message: "Story created", story });
});
exports.createStory = createStory;
const searchForUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Name } = req.query;
        const response = yield Users.aggregate([
            {
                $search: {
                    index: "user",
                    autocomplete: {
                        query: Name,
                        path: "Name",
                        fuzzy: {
                            maxEdits: 1,
                        },
                    },
                },
            },
            { $limit: 5 },
        ]);
        return res.json(response);
    }
    catch (err) {
        return next(new CustomError_1.HttpError(401, `${err}`));
    }
});
exports.searchForUser = searchForUser;
const getRequestDetail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    let existingUser;
    try {
        existingUser = yield Users.findById(userId);
    }
    catch (_m) {
        return next(new CustomError_1.HttpError(404, "user not found"));
    }
    if (!existingUser) {
        return next(new CustomError_1.HttpError(404, "user not found"));
    }
    const request = yield Users.find({ _id: { $in: existingUser.Requests } });
    res.json({ request, message: "request fetched" });
});
exports.getRequestDetail = getRequestDetail;
const unfriendUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentUserId, unfriendUserId } = req.body;
    let currentUser, removeUser;
    try {
        currentUser = yield Users.findById(currentUserId);
        removeUser = yield Users.findById(unfriendUserId);
    }
    catch (err) {
        return next(new CustomError_1.HttpError(401, `${err}`));
    }
    if (!currentUser || !removeUser) {
        return next(new CustomError_1.HttpError(401, "No user found"));
    }
    try {
        currentUser.Friends = currentUser.Friends.filter((item) => item === unfriendUserId);
        removeUser.Friends = removeUser.Friends.filter((item) => item === currentUserId);
        yield currentUser.save();
        yield removeUser.save();
    }
    catch (err) {
        return next(new CustomError_1.HttpError(401, `${err}`));
    }
    res.json({ currentUser, removeUser, message: "Removed" });
});
exports.unfriendUser = unfriendUser;
