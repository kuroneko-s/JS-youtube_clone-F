import express from "express";
import {
  deleteVideo,
  getEdit,
  postEdit,
  watch,
  getUpload,
  postUpload,
} from "../controller/videosController";
import { protectorMiddleware, videoUpload } from "../middlewares";

// /videos
const videoRouter = express.Router();

/*
videoRouter.get("/:id(\\d+)/edit", getEdit);
videoRouter.post("/:id(\\d+)/edit", postEdit);
*/
// -> 이렇게 사용할 수 있다.
videoRouter
  .route("/upload")
  .all(protectorMiddleware)
  .get(getUpload)
  .post(
    videoUpload.fields([
      {
        name: "video",
        maxCount: 1,
      },
      {
        name: "thumb",
        maxCount: 1,
      },
    ]),
    postUpload
  );
videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(postEdit);
videoRouter.get("/:id([0-9a-f]{24})/delete", protectorMiddleware, deleteVideo);
export default videoRouter;
