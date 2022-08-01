const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "thanksLetter",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      answerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "answers",
          key: "id",
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "thanksLetter",
      // timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "FK_answers_TO_thanksLetter_1",
          using: "BTREE",
          fields: [{ name: "answerId" }],
        },
      ],
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci",
    }
  );
};
