const { models } = require("../models");

module.exports = {
  // 답변 생성
  registerAnswer: async (req, res) => {
    const id = req.user.profile.id;
    const user = await models.user.findOne({ where: { snsId: id } });
    const userId = user.id;
    const questionId = req.params.questionId;

    await models.answers.create({
      // fk인 questionId랑 answererId는 자동으로 생기나? -> ㄴㄴ 내가 지정해줘야 함. 지정된 애들끼리 관계가 자동으로 생기는것.ㄴ
      questionId: questionId,
      contentText: req.body.contentText,
      contentVideo: req.body.contentVideo,
      contentVoice: req.body.contentVoice,
      title: req.body.title,
      price: req.body.price,
      answererId: userId,
    });

    const question = await models.questions.findOne({
      where: { id: questionId },
    });
    await question.update({
      isAnswered: true,
    });
  },
  // 답변 정보 조회
  getAnswer: async (req, res) => {
    const answerId = req.params.answerId;
    const answer = await models.answers.findOne({
      where: { id: answerId },
      include: [
        {
          model: models.user,
          as: "answerer",
          required: true,
        },
        {
          model: models.questions,
          as: "question",
          required: true,
          include: [
            {
              model: models.user,
              as: "questioner",
              required: true,
              attributes: ["nickname"],
            },
          ],
        },
      ],
    });
    res.json(answer);
  },
  // 답변 수정
  modifyAnswer: async (req, res) => {
    const answerId = req.params.answerId;
    const answer = await models.answers.findOne({
      where: { id: answerId },
    });
    await answer.update({
      contentText: req.body.contentText,
    });
  },
};
