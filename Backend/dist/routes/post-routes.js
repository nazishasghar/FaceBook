"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageUpload = exports.postRouter = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const check_auth_1 = require("../controllers/middleware/check_auth");
const post_controller_1 = require("../controllers/post-controller");
exports.postRouter = (0, express_1.default)();
const imageStorage = multer_1.default.diskStorage({
    // Destination to store image
    destination: "./public",
    filename: (req, file, cb) => {
        cb(null, Date.now().toString().replace(/:/g, "-") + "-" + file.originalname);
        // file.fieldname is name of the field (image)
        // path.extname get the uploaded file extension
    },
});
exports.imageUpload = (0, multer_1.default)({
    storage: imageStorage,
    limits: {
        fileSize: 1000000, // 1000000 Bytes = 1 MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            // upload only png and jpg format
            return cb(new Error("Please upload a Image"));
        }
        cb(null, true);
    },
});
exports.postRouter.use(check_auth_1.authorizationMiddleware);
exports.postRouter.post("/", exports.imageUpload.single("ImageUrl"), post_controller_1.createPost);
exports.postRouter.post("/:pid", post_controller_1.getPostById);
exports.postRouter.delete("/:pid", post_controller_1.deletePost);
exports.postRouter.get("/", post_controller_1.getAllPost);
exports.postRouter.post("/sendLike/:pid", post_controller_1.sendLikeOnPost);
exports.postRouter.post("/disLike/:pid", post_controller_1.removeLikeOnPost);
exports.postRouter.post("/commentOnPost/:pid", post_controller_1.commentOnPost);
