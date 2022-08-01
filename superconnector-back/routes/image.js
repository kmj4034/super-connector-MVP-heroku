// 이미지 업로드
const multer = require("multer");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
const express = require("express");
const router = express.Router();
const cors = require("cors");
const { models } = require("../models/index");
require("dotenv").config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESSKEY,
  region: "ap-northeast-2",
});

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESSKEY,
  region: "ap-northeast-2",
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "handalus",
    key: function (req, file, cb) {
      var ext = file.mimetype.split("/")[1];
      if (!["png", "jpg", "jpeg", "gif", "bmp"].includes(ext)) {
        return cb(new Error("Only images are allowed"));
      }
      cb(null, Date.now() + "." + file.originalname.split(".").pop());
    },
  }),
  acl: "public-read-write",
  limits: { fileSize: 5 * 1024 * 1024 },
});

// 이미지 업로드 요청
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const id = req.user.profile.id;
    const user = await models.user.findOne({ where: { snsId: id } });
    console.log("작업중");
    await user.update({
      userPic: req.file.location,
    });
    res.status(200).json({ location: req.file.location });
  } catch {
    (err) => {
      console.log(err);
      res.status(500).json({ error: err });
    };
  }
});

module.exports = router;
