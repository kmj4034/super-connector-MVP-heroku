const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.ctrl");

// 마이페이지
// 로그인한 유저의 프로필 정보 조회
router.get("/", userController.getUser);
// 답변자로 등록한 유저들만 조회
router.get("/getEnrolledUsers", userController.getEnrolledUsers);
// 프로필 정보 수정
router.patch("/updateProfile", userController.updateProfile);
// 답변자 등록
router.patch("/enrollAnswerer", userController.enrollAnswerer);
// 유저 상세 정보 조회
router.get("/:userId", userController.getUserInfo);

module.exports = router;
