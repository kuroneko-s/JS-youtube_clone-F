import { isValidObjectId } from "mongoose";
import Video from "../models/Video";

/*
  this is callback
  Video.find({}, (error, videos) => {}
*/

export const home = async (req, res) => {
  try {
    const videos = await Video.find({});
    return res.render("home", { pageTitle: "Home", videos });
  } catch (error) {
    console.log(error);
    return res.render("server-error", { error });
  }
};
export const watch = async (req, res) => {
  const {
    params: { id },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.render("404", { pageTitle: "Video Not Found" });
  }
  return res.render("watch", { pageTitle: video.title, video });
};
export const getEdit = async (req, res) => {
  const {
    params: { id },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.render("404", { pageTitle: "Video Not Found" });
  }

  return res.render("edit", { pageTitle: `Edit #${video.title}`, video });
};

export const postEdit = (req, res) => {
  const { id } = req.params;
  const { newTitle } = req.body;

  res.redirect(`/videos/${id}`);
};

export const search = (req, res) => res.send("Search");
export const deleteVideo = (req, res) => res.send("delete video");

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  try {
    await Video.create({
      title,
      description,
      hashtags: hashtags.split(",").map((w) => `#${w}`),
    });
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }

  /*
  // 위랑 동일
  const video = new Video({
    title,
    description,
    createdAt: Date.now(),
    hashtags: hashtags.split(",").map((w) => `#${w}`),
    meta: {
      views: 0,
      rating: 0,
    },
  });
  await video.save(); // Model로 작성했으니깐 save() 동작한듯
  */
};
