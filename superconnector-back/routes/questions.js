const express = require("express");
const router = express.Router();
const questionsController = require("../controllers/questions.ctrl");

// 질문 정보 조회
router.get("/to/:userId", questionsController.getQuestions);
// 질문 상세 정보
router.get("/:questionId", questionsController.getQuestion);
// 내게 온 질문
router.get("/toMe", questionsController.getQuestionsToMe);
// 내가 보낸 질문
router.get("/from/:userId", questionsController.getQuestionsFrom);
// 질문 생성
router.post("/register/:toAnswererId", questionsController.registerQuestion);
// 질문 삭제
router.delete("/delete/:questionId", questionsController.deleteQuestion);
// 좋아요 추가
router.patch("/upvote/:questionId", questionsController.upvoteQuestion);
// 질문 수정
router.patch("/update/:questionId", questionsController.updateQuestion);

module.exports = router;
