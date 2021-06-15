import express from "express";
import {
  getJoin,
  getLogin,
  postJoin,
  postLogin,
} from "../controller/usersController";
import { home, search } from "../controller/videosController";
import { publicOnlyMiddleware } from "../middlewares";

// /
const rooteRouter = express.Router();

rooteRouter
  .route("/join")
  .all(publicOnlyMiddleware)
  .get(getJoin)
  .post(postJoin);
rooteRouter
  .route("/login")
  .all(publicOnlyMiddleware)
  .get(getLogin)
  .post(postLogin);
rooteRouter.get("/", home);
rooteRouter.get("/search", search);

export default rooteRouter;
