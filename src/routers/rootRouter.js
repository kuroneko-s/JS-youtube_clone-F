import express from "express";
import {
  getJoin,
  getLogin,
  postJoin,
  postLogin,
} from "../controller/usersController";
import { home, search } from "../controller/videosController";

// /
const rooteRouter = express.Router();

rooteRouter.route("/join").get(getJoin).post(postJoin);
rooteRouter.route("/login").get(getLogin).post(postLogin);
rooteRouter.get("/", home);
rooteRouter.get("/search", search);

export default rooteRouter;
