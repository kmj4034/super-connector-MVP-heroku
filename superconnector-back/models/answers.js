const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "answers",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      answererId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
      },
      questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "questions",
          key: "id",
        },
      },
      contentText: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      contentVideo: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      contentVoice: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "answers",
      // timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "FK_user_TO_answers_1",
          using: "BTREE",
          fields: [{ name: "answererId" }],
        },
        {
          name: "FK_questions_TO_answers_1",
          using: "BTREE",
          fields: [{ name: "questionId" }],
        },
      ],
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci",
      timestamps: true,
    }
  );
};
