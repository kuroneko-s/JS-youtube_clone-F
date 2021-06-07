import express from "express";
import { edit, logout, deleteUser, see } from "../controller/usersController";

// /users
const userRouter = express.Router();

userRouter.get("/edit", edit);
userRouter.get("/delete", deleteUser);
userRouter.get("/logout", logout);
userRouter.get("/:id/:potato", see);

export default userRouter;
