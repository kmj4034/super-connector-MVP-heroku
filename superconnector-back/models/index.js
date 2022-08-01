const initModels = require("./init-models"); // initModels.js에서 메서드를 가져온다
const Sequelize = require("sequelize");

// config/config.json 파일에 있는 설정값(DB 설정값)들을 불러온다.
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

// mysql 연결 객체를 생성
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

// 이런식으로 db 객체에 담아서 export해줘야 함
db.sequelize = sequelize;
db.models = initModels(sequelize);

module.exports = db;
