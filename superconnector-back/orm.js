const SequelizeAuto = require("sequelize-auto");
require("dotenv").config();
const auto = new SequelizeAuto(
  process.env.MYSQL_USERNAME,
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    dialect: "mysql",
    directory: "./models",
  }
);
auto.run((err) => {
  if (err) throw err;
});
