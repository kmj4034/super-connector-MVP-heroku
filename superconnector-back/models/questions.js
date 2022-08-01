const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "questions",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      questionerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
      },
      content1: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      content2: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      content3: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      upvote: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      isAnswered: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      toAnswererId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      createdAt: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: true,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      tableName: "questions",
      // timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "FK_user_TO_questions_1",
          using: "BTREE",
          fields: [{ name: "questionerId" }],
        },
      ],
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci",
      timestamps: true,
    }
  );
};
