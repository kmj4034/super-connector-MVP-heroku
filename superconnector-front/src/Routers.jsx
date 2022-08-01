import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./routes/Home.jsx";
import UserDetail from "./routes/UserDetail.jsx";
import MyPage from "./routes/MyPage.jsx";
import QuestionFromMe from "./routes/QuestionFromMe.jsx";
import QuestionToMe from "./routes/QuestionToMe.jsx";
import AskQuestion from "./routes/AskQuestion.jsx";
import GiveAnswer from "./routes/GiveAnswer.jsx";
import AnswerDetail from "./routes/AnswerDetail.jsx";
import ModifyAnswer from "./routes/ModifyAnswer.jsx";
import ModifyQuestion from "./routes/ModifyQuestion.jsx";

function Routers() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:id" element={<UserDetail />} />
        <Route path="/to:id/askQuestion" element={<AskQuestion />} />
        <Route
          path="/:toAnswererId/modifyQuestion/:questionId"
          element={<ModifyQuestion />}
        />
        {/* 로그인한 사용자의 페이지 */}
        <Route path="/mypage/:userId" element={<MyPage />}>
          <Route path="fromMe" element={<QuestionFromMe />}></Route>
          <Route path="toMe" element={<QuestionToMe />}></Route>
        </Route>
        <Route path="/giveAnswer/:questionId" element={<GiveAnswer />} />
        <Route path="/modifyAnswer/:questionId" element={<ModifyAnswer />} />
        <Route path="/answer/:answerId" element={<AnswerDetail />} />
      </Routes>
    </Router>
  );
}

export default Routers;
