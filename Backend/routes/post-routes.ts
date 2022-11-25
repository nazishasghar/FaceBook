import express from "express";
import multer from "multer";
import path from "path";
import { authorizationMiddleware } from "../controllers/middleware/check_auth";
import {
  createPost,
  getPostById,
  deletePost,
  getAllPost,
  sendLikeOnPost,
  removeLikeOnPost,
  commentOnPost,
} from "../controllers/post-controller";
export const postRouter = express();
const imageStorage = multer.diskStorage({
  // Destination to store image
  destination: "./public",
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now().toString().replace(/:/g, "-") + "-" + file.originalname
    );
    // file.fieldname is name of the field (image)
    // path.extname get the uploaded file extension
  },
});

export const imageUpload = multer({
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
postRouter.use(authorizationMiddleware);
postRouter.post("/", imageUpload.single("ImageUrl"), createPost);
postRouter.post("/:pid", getPostById);
postRouter.delete("/:pid", deletePost);
postRouter.get("/", getAllPost);
postRouter.post("/sendLike/:pid", sendLikeOnPost);
postRouter.post("/disLike/:pid", removeLikeOnPost);
postRouter.post("/commentOnPost/:pid", commentOnPost);
