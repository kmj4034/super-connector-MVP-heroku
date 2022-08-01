const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "likes",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    {
      sequelize,
      tableName: "likes",
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci",
      timestamps: false,
    }
  );
};
