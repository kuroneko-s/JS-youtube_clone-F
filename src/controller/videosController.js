export const home = (req, res) => {
  res.render("home", { pageTitle: "Home" });
};
export const see = (req, res) => {
  res.render("watch", { pageTitle: "Watch" });
};
export const edit = (req, res) => {
  res.render("edit", { pageTitle: "Edit Video" });
};
export const search = (req, res) => res.send("Search");
export const deleteVideo = (req, res) => res.send("delete video");
export const upload = (req, res) => res.send("upload");
