export const localsMiddleware = (req, res, next) => {
  // locals는 pug에서 접근이 가능한 변수이다.
  res.locals.siteName = "Wetube";
  // True or False 값 확인
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  // req.session 하면 요청한 클라이언트에 대해서만 띄워줌

  res.locals.loggedInUser = req.session.user;
  console.log(res.locals);
  next();
};
