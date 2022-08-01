const { models } = require("../models/index");

module.exports = {
  getQuestions: async (req, res) => {
    // 특정 유저에게 보낸 질문 정보 조회
    const userId = req.params.userId;
    const questions = await models.questions.findAll({
      where: {
        toAnswererId: userId,
      },
      include: [
        {
          model: models.user,
          as: "questioner", // init-models에 정의된 as 값으로 써야 함
          required: true,
        },
        // 여기서 answer정보까지 주는게 best는 아니지만 일단 만들어보자..!
        {
          model: models.answers,
          as: "answers",
          required: false,
          include: [
            {
              model: models.user,
              as: "answerer",
              required: true,
              attributes: ["nickname", "company", "job"],
            },
          ],
        },
      ],
    });
    res.json(questions);
  },
  getQuestion: async (req, res) => {
    // 질문 상세 조회
    const questionId = req.params.questionId;
    const question = await models.questions.findOne({
      where: { id: questionId },
      include: [
        {
          model: models.user,
          as: "questioner",
          required: true,
        },
        {
          model: models.answers,
          as: "answers",
          required: false, // left join. 합집합 형태
        },
      ],
    });
    res.json(question);
  },
  getQuestionsToMe: async (req, res) => {
    // 내게 온 질문
    const id = req.user.profile.id;
    const user = await models.user.findOne({ where: { snsId: id } });
    const userId = user.id;
    const questionsToMe = await models.questions.findAll({
      where: {
        toAnswererId: userId,
      },
    });
    res.json(questionsToMe);
  },
  // 질문 수정
  updateQuestion: async (req, res) => {
    const questionId = req.params.questionId;
    const question = await models.questions.findOne({
      where: { id: questionId },
    });
    await question.update({
      title: req.body.title,
      content1: req.body.content1,
      content2: req.body.content2,
    });
  },
  // 질문 보내기
  registerQuestion: async (req, res) => {
    const id = req.user.profile.id; // app.js에 body-parser 추가하니깐 됐음!
    const user = await models.user.findOne({ where: { snsId: id } });
    const userId = user.id;
    const toAnswererId = req.params.toAnswererId;

    await models.questions.create({
      questionerId: userId,
      title: req.body.title,
      content1: req.body.content1,
      content2: req.body.content2,
      toAnswererId: toAnswererId,
    });
  },

  // 내가 보낸 질문 조회
  getQuestionsFrom: async (req, res) => {
    const userId = req.params.userId;
    const questionsFromMe = await models.questions.findAll({
      where: {
        questionerId: userId,
      },
      include: {
        model: models.user,
        as: "toAnswerer",
        required: true,
        attributes: ["nickname"],
      },
    });
    res.json(questionsFromMe);
  },

  // 질문 삭제
  deleteQuestion: async (req, res) => {
    const questionId = req.params.questionId;
    const question = await models.questions.findOne({
      where: { id: questionId },
    });
    await question.destroy();
  },

  // upvote 추가
  upvoteQuestion: async (req, res) => {
    const questionId = req.params.questionId;
    const question = await models.questions.findOne({
      where: { id: questionId },
    });
    const userId = req.body.userId;
    const likes = await models.likes.findOne({
      where: {
        questionId: questionId,
        userId: userId,
      },
    });
    if (!likes) {
      await question.update({
        upvote: question.upvote + 1,
      });
      await models.likes.create({
        questionId: questionId,
        userId: userId,
      });
      res.send(true);
    } else {
      res.send(false);
    }
  },
};
