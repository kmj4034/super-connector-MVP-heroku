require("dotenv").config();

const express = require("express");
const path = require("path");
const morgan = require("morgan");
const { sequelize } = require("./models/index"); // sequelize 객체를 가져온다
const passport = require("passport");
// const passportConfig = require("./passport");
const authRouter = require("./routes/auth");
const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
const questionsRouter = require("./routes/questions");
const imageRouter = require("./routes/image");
const answerRouter = require("./routes/answers");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const KakaoStrategy = require("passport-kakao").Strategy;
const { models } = require("./models/index");

const app = express();
// passportConfig();

const cors = require("cors");
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

sequelize
  .sync({ force: false, alter: true }) // force: true 설정 시 서버를 실행할 때마다 테이블 재생성
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: false,
      secure: false,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Kakao Login Strategy
passport.use(
  new KakaoStrategy(
    {
      clientID: process.env.KAKAO_ID,
      callbackURL: "/auth/kakao/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const exUser = await models.user.findOne({
        where: { snsId: profile.id, provider: "kakao" },
      });
      if (exUser) {
        let user = {
          profile: profile._json,
          accessToken: accessToken,
        };
        done(null, user);
      } else {
        // accessToken, profile 등은 카카오에서 제공하는 정보임. 우리 사이트에 가입 되어 있었는지 여부는 상관 x.
        await models.user.create({
          email: profile._json && profile._json.kakao_account_email,
          nickname: profile.displayName,
          snsId: profile.id,
          provider: "kakao",
        });
        let user = {
          profile: profile._json,
          accessToken: accessToken,
        };
        done(null, user);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  console.log(`user : ${user.profile.id}`);
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  // const myObj = JSON.stringify(obj);
  // console.log(`obj : ${myObj}`);
  console.log("user", user);
  done(null, user);
});
// passport.serializeUser(function (user, done) {
//   console.log(`user : ${user.profile.id}`);
//   done(null, user.id);
// });
// passport.deserializeUser(function (id, done) {
//   models.user
//     .findOne({
//       where: { id: id },
//     })
//     .then((user) => {
//       done(null, user);
//     })
//     .catch((err) => {
//       done(err, null);
//     });
//   done(null, obj);
// });

app.use(morgan("dev"));

// routing path
app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/questions", questionsRouter);
app.use("/image", imageRouter);
app.use("/answers", answerRouter);

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
