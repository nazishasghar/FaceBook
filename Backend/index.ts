import express, {
  ErrorRequestHandler,
  Express,
  Request,
  Response,
  NextFunction,
} from "express";
import dotenv from "dotenv";
import { router } from "./routes/users-routes";
import { postRouter } from "./routes/post-routes";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { messageRouter } from "./message-routes";
import { authorizationMiddleware } from "./controllers/middleware/check_auth";
import { authRouter } from "./routes/login-routes";
dotenv.config();
const app: Express = express();

app.use(bodyParser.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With,Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
  return next();
});

const ErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res
    .status(err.code || 500)
    .json({ message: err.message || "An unknown error has occured" });
};
app.use(ErrorHandler);
app.use("/api/auth", authRouter);
app.use("/public", express.static("public"));
app.use("/api/users", router);
app.use("/api/post", postRouter);
app.use("/api/messages", messageRouter);
// Custom Error Handling

mongoose
  .connect(
    "mongodb+srv://Nazish:sCj4JWBk91a4R5uN@cluster0.pjdokdn.mongodb.net/facebook?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(3004, () => {
      console.log(`⚡️[server]: Server is running a https://localhost:3004`);
    });
  })

  .catch((err) => {
    console.log(err);
  });
