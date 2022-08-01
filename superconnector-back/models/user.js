const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      password: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      nickname: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      phoneNumber: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      userPic: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      snsId: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      provider: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      job: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      company: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      careerYear: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      desc: {
        type: DataTypes.STRING(250),
        allowNull: true,
      },
      isAnswerer: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      tableName: "user",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
      ],
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci",
    }
  );
};
