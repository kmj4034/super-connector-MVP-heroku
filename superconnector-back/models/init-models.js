var DataTypes = require("sequelize").DataTypes;
var _answers = require("./answers");
var _questions = require("./questions");
var _thanksLetter = require("./thanksLetter");
var _user = require("./user");
var _likes = require("./likes");

function initModels(sequelize) {
  var answers = _answers(sequelize, DataTypes);
  var questions = _questions(sequelize, DataTypes);
  var thanksLetter = _thanksLetter(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);
  var likes = _likes(sequelize, DataTypes);

  thanksLetter.belongsTo(answers, { as: "answer", foreignKey: "answerId" });
  answers.hasMany(thanksLetter, {
    as: "thanksLetters",
    foreignKey: "answerId",
  });
  answers.belongsTo(questions, { as: "question", foreignKey: "questionId" });
  questions.hasMany(answers, { as: "answers", foreignKey: "questionId" });
  answers.belongsTo(user, { as: "answerer", foreignKey: "answererId" });
  user.hasMany(answers, { as: "answers", foreignKey: "answererId" });
  questions.belongsTo(user, { as: "questioner", foreignKey: "questionerId" });
  user.hasMany(questions, { as: "questions", foreignKey: "questionerId" });
  questions.belongsToMany(user, {
    as: "likers",
    through: likes,
    foreignKey: "questionId",
  });
  user.belongsToMany(questions, {
    as: "likedQuestions",
    through: likes,
    foreignKey: "userId",
  });
  questions.belongsTo(user, { as: "toAnswerer", foreignKey: "toAnswererId" });

  return {
    answers,
    questions,
    thanksLetter,
    user,
    likes,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
