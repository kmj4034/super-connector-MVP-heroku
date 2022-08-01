const express = require("express");
const router = express.Router();
const answerController = require("../controllers/answers.ctrl");

// 답변 생성
router.post("/register/:questionId", answerController.registerAnswer);
router.get("/:answerId", answerController.getAnswer);
router.patch("/modify/:answerId", answerController.modifyAnswer);

module.exports = router;
