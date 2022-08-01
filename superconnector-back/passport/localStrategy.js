const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const { models } = require("../models/index");

module.exports = () => {
  //? auth 라우터에서 /login 요청이 오면 local설정대로 이쪽이 실행되게 된다.
  passport.use(
    new LocalStrategy(
      {
        //* req.body 객체인자 하고 키값이 일치해야 한다.
        usernameField: "email", // req.body.email
        passwordField: "password", // req.body.password
      },
      //* 콜백함수의  email과 password는 위에서 설정한 필드이다. 위에서 객체가 전송되면 콜백이 실행된다.
      async (email, password, done) => {
        try {
          // 가입된 회원인지 아닌지 확인
          const exUser = await models.user.findOne({ where: { email } }); // {where: {email: email}} 같은 뜻!
          // 만일 가입된 회원이면
          if (exUser) {
            // 해시비번을 비교
            const result = await bcrypt.compare(password, exUser.password);
            if (result) {
              done(null, exUser); //? 성공이면 done()의 2번째 인수에 선언
            } else {
              done(null, false, { message: "incorrect password" }); //? 실패면 done()의 2번째 인수는 false로 주고 3번째 인수에 선언
            }
            //? done()을 호출하면, /login 요청온 auth 라우터로 다시 돌아가서 미들웨어 콜백을 실행하게 된다.
          }
          // DB에 해당 이메일이 없다면, 회원 가입 한적이 없다.
          else {
            done(null, false, { message: "not a member" });
          }
        } catch (error) {
          console.error(error);
          done(error); //? done()의 첫번째 함수는 err용. 특별한것 없는 평소에는 null로 처리.
        }
      }
    )
  );
};
