"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const check_auth_1 = require("../controllers/middleware/check_auth");
const user_controller_1 = require("../controllers/user-controller");
const post_routes_1 = require("./post-routes");
exports.router = (0, express_1.default)();
// Routes
exports.router.get("/search/searchForUser", user_controller_1.searchForUser);
exports.router.use(check_auth_1.authorizationMiddleware);
exports.router.get("/", user_controller_1.getAllUser);
exports.router.get("/:uid", user_controller_1.getUserbyId);
exports.router.delete("/:uid", user_controller_1.deleteUser);
exports.router.post("/friends/sendRequest", user_controller_1.sendRequest);
exports.router.post("/friends/addFriend", user_controller_1.addFriend);
exports.router.post("/friends/getFriends", user_controller_1.getAllFriends);
exports.router.post("/stories/createStory", post_routes_1.imageUpload.single("imageUrl"), user_controller_1.createStory);
exports.router.get("/stories/getAllStories", user_controller_1.getStories);
exports.router.patch("/updateUser", post_routes_1.imageUpload.single("updatedProfilePic"), user_controller_1.updateUser);
exports.router.post("/friends/removeRequest", user_controller_1.removeRequest);
exports.router.post("/friends/getAllRequest", user_controller_1.getRequestDetail);
exports.router.post("/friends/unfriend", user_controller_1.unfriendUser);
