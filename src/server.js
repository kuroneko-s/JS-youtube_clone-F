import express from "express";
import morgan from "morgan";
import session from "express-session";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/usersRouter";
import videoRouter from "./routers/videosRouter";

const app = express();

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "Hello!",
    resave: true,
    saveUninitialized: true,
  })
);

app.use((req, res, next) => {
  console.log(req.headers.cookie);
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

app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;
