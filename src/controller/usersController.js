import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res) => {
  const pageTitle = "Join";
  const { name, email, username, password1, password2, location } = req.body;

  if (password1 !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Password and ConfirmPassword does not match.",
    });
  }

  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (exists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This username/email is already taken",
    });
  }

  try {
    await User.create({
      name,
      email,
      username,
      password: password1,
      location,
    });

    return res.redirect("/login");
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .render("join", { pageTitle, errorMessage: error._message });
  }
};

export const edit = (req, res) => res.send("Edit");

export const getLogin = (req, res) => {
  return res.render("login", { pageTitle: "Login" });
};
export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  const pageTitle = "Login";

  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "An account with this username does not exists.",
    });
  }

  // password check in db to request body
  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "An account with this username does not exists.",
    });
  }

  // add user information by session
  req.session.loggedIn = true;
  req.session.user = user;
  // create user Authentication token.
  return res.redirect("/");
};

export const logout = (req, res) => {
  req.session.loggedIn = false;
  req.session.user = null;
  return res.redirect("/");
};
export const see = (req, res) => {
  console.log(req.params);
  res.send("See User");
};
export const deleteUser = (req, res) => res.send("Delete User");
