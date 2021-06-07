import express from "express";
import {
  deleteVideo,
  edit,
  watch,
  upload,
} from "../controller/videosController";

// /videos
const videoRouter = express.Router();

videoRouter.get("/upload", upload);
videoRouter.get("/:id", watch);
videoRouter.get("/:id/edit", edit);
videoRouter.get("/:id/delete", deleteVideo);

export default videoRouter;
