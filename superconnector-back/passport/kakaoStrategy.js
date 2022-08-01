// const passport = require("passport");
// const KakaoStrategy = require("passport-kakao").Strategy;
// const express = require("express");
// const router = express.Router();

// const { models } = require("../models/index");

// module.exports = () => {
//   passport.use(
//     new KakaoStrategy(
//       {
//         clientID: process.env.KAKAO_ID, // 미리 설정한 REST API 키
//         callbackURL: "/auth/kakao/callback", // redirect URI. 여기에
//       },
//       async (accessToken, refreshToken, profile, done) => {
//         console.log("kakao profile", profile);
//         console.log("access token", accessToken);
//         try {
//           const exUser = await models.user.findOne({
//             where: { snsId: profile.id, provider: "kakao" },
//           });
//           if (exUser) {
//             // 로그인 성공 (done의 첫번째 인수에는 error가 들어감)
//             // 로그인 완료되면 카카오 profile의 이메일을 회원 DB의 이메일 정보로 업데이트
//             // const tokenUser = {
//             //   user: exUser,
//             //   accessToken: accessToken || "",
//             // };
//             done(null, exUser);
//           } else {
//             // 회원가입 후 로그인 성공
//             const newUser = await models.user.create({
//               email: profile._json && profile._json.kakao_account_email,
//               nickname: profile.displayName,
//               snsId: profile.id,
//               provider: "kakao",
//             });
//             // const tokenUser = {
//             //   user: newUser,
//             //   accessToken: accessToken || "",
//             // };
//             done(null, newUser);
//           }
//         } catch (err) {
//           console.error(err);
//           done(err);
//         }
//       }
//     )
//   );
// };
