import express from "express";
import morgan from "morgan";
import flash from "express-flash";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/usersRouter";
import videoRouter from "./routers/videosRouter";
import apiRouter from "./routers/apiRouter";
import { localsMiddleware } from "./middlewares";

const app = express();

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// create session
app.use(
  session({
    secret: process.env.SESSION_SECRET, // 감춰야 함
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_DB_URL,
    }),
  })
);
/*
app.use((req, res, next) => {
    // session에 있는 모든 정보를 보여주는 거고
  req.sessionStore.all((error, sessions) => {
    console.log("sessions - ", sessions);
  });
  next();
});

app.get("/add-one", (req, res, next) => {
  req.session.potato += 1;
  const cookie = req.session.id;
  return res.send(`${req.session.id} /  / ${req.session.potato}`);
});
*/
// flash() 이후부터 req.flash 사용이 가능해진다.
app.use(flash());
app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));
app.use("/core", express.static("node_modules/@ffmpeg/core/dist"));
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter);

export default app;
