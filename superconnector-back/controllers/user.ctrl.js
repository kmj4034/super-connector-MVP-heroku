const { models } = require("../models/index");

module.exports = {
  getUser: async (req, res) => {
    try {
      const id = req.user.profile.id;
      const user = await models.user.findOne({ where: { snsId: id } });
      res.json(user);
    } catch (err) {
      console.log(err);
    }
  },
  updateProfile: async (req, res) => {
    const id = req.user.profile.id;
    const user = await models.user.findOne({ where: { snsId: id } });
    await user.update({
      careerYear: req.body.careerYear,
      company: req.body.company,
      job: req.body.job,
      userPic: req.body.userPic,
      desc: req.body.desc,
    });
  },
  // 답변자로 등록
  enrollAnswerer: async (req, res) => {
    const id = req.user.profile.id;
    const user = await models.user.findOne({ where: { snsId: id } });
    user.update({
      isAnswerer: req.body.isAnswerer,
    });
  },
  // 답변자로 등록된 유저의 정보 조회
  getEnrolledUsers: async (req, res) => {
    const users = await models.user.findAll({ where: { isAnswerer: true } });
    res.json(users);
  },
  // 특정 id를 가진 유저의 정보 조회
  getUserInfo: async (req, res) => {
    const userId = req.params.userId;
    const user = await models.user.findOne({ where: { id: userId } });
    res.json(user);
  },
};
