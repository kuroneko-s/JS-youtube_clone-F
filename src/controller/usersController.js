import User from "../models/User";
import Video from "../models/Video";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

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

export const getLogin = (req, res) => {
  return res.render("login", { pageTitle: "Login" });
};
export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, socuialOnly: false });
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
  req.session.destroy();
  return res.redirect("/");
};
// 로그아웃 된 상태에서도 접근이 가능함
export const see = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate("videos");

  if (!user) {
    return res.status(404).render("404", { pageTitle: "User Not Found" });
  }

  return res.render("users/profile", {
    pageTitle: user.name,
    user,
  });
};
export const deleteUser = (req, res) => res.send("Delete User");

export const startGithubLogin = (req, res) => {
  const baseURL = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GIT_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  // URLSearchParams를 쓰면 Object를 URL식으로 바꿔버린다.
  const params = new URLSearchParams(config).toString();

  return res.redirect(`${baseURL}?${params}`);
};

export const finishGithubLogin = async (req, res) => {
  const baseURL = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GIT_CLIENT,
    client_secret: process.env.GIT_SECRET,
    code: req.query.code,
  };

  const params = new URLSearchParams(config).toString();

  const tokenRequest = await (
    await fetch(`${baseURL}?${params}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();

  // access token 에서 추가적인 정보들을 읽어올 수 있다.
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    // /user/emails
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();

    // access token을 이용해서 email List 받아오기
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );

    if (!emailObj) {
      // set notification
      return res.redirect("/login");
    }

    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      // 해당 이메일에 해당하는 계정이 없으니깐 생성
      // create an account
      user = await User.create({
        name: userData.name,
        email: emailObj.email,
        socuialOnly: true,
        username: userData.login,
        password: "",
        location: userData.location,
        avatarUrl: userData.avatar_url,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "Edit Profile" });
};

export const postEdit = async (req, res) => {
  console.log(req.session.user);
  console.log(req.body);
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { name, email, username, location },
    file,
  } = req;

  console.log(file);
  // 수정된 값 찾기
  const result = changedValue(req.session.user, req.body, [
    "name",
    "email",
    "username",
    "location",
  ]);

  if (result.length > 0) {
    const exists = await User.exists({ $or: result });
    if (exists) {
      return res.render("edit-profile", {
        pageTitle: "Edit Profile",
        errorMessage: "Duplicate Value",
      });
    }
  }

  const updateUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? file.path : avatarUrl,
      name,
      email,
      username,
      location,
    },
    {
      new: true, // 업데이트 된 놈을 리턴해줌
    }
  );

  req.session.user = updateUser;

  return res.redirect("/users/edit");
};

const changedValue = (user, body, checkVal) => {
  let arr = [];
  checkVal
    .filter((str) => user[str] !== body[str])
    .map((result) => arr.push({ [result]: body[result] }));
  return arr;
};

export const getChangePassword = (req, res) => {
  if (req.session.user.socuialOnly) {
    return res.redirect("/");
  }
  return res.render("users/change-password", { pageTitle: "change Password" });
};
export const postChangePassword = async (req, res) => {
  // send notification
  const {
    session: {
      user: { _id, password },
    },
    body: { oldPassword, newPassword, newPasswordConfirmation },
  } = req;

  if (newPassword !== newPasswordConfirmation) {
    return res.status(400).render("users/change-password", {
      pageTitle: "change Password",
      errorMessage: "The password does not match the confirmation",
    });
  }

  const ok = bcrypt.compareSync(oldPassword, password);
  if (!ok) {
    return res.status(400).render("users/change-password", {
      pageTitle: "change Password",
      errorMessage: "The current password is incorrect",
    });
  }

  const user = await User.findById(_id);
  console.log(user.password);
  user.password = newPassword;
  console.log(user.password);
  await user.save();
  console.log(user.password);

  req.session.user = user;

  return res.redirect("/users/logout");
};
