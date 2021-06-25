import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  // locals는 pug에서 접근이 가능한 변수이다.
  res.locals.siteName = "Wetube";
  // True or False 값 확인
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  // req.session 하면 요청한 클라이언트에 대해서만 띄워줌

  res.locals.loggedInUser = req.session.user || {};
  // console.log(res.locals);
  next();
};

// 로그인이 안되어있는데 접근하려고 할때 컷!
export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Not authorized");
    return res.redirect("/login");
  }
};

// 로그인이 되어있는데 접근하려고 할때 컷!
export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    // flash -> locals 값 추가해준다.
    req.flash("error", "Not authorized");
    return res.redirect("/");
  }
};

// 파일을 보내면 감지해서 uploads/로 보내는 미들웨이
export const avatarUpload = multer({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 3000000,
  },
});

/*
  https://www.npmjs.com/package/multer
  limits: fileSize => 용량제한
*/
export const videoUpload = multer({
  dest: "uploads/videos",
  limits: {
    fileSize: 10000000,
  },
});
