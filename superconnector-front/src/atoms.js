import axios from "axios";
import { atom, selector, selectorFamily } from "recoil";
import { v1 } from "uuid";

const BASE_URL = process.env.REACT_APP_BACK_BASE_URL;

export const base_url = atom({
  key: "base_url",
  default: BASE_URL,
});

export const isEnrolled = atom({
  key: `isEnrolled${v1}`,
  default: false,
});

// 로그인한 유저 정보
export const userInfoSelector = selector({
  key: "userInfoSelector",
  get: async () => {
    return await axios.get(`${BASE_URL}/user`);
  },
});

// 특정 유저 정보
export const getUserInfoSelector = selectorFamily({
  key: "getUserInfoSelector",
  get: (userId) => async () => {
    return await axios.get(`${BASE_URL}/user/${userId}`);
  },
});

// 특정 유저가 보낸 질문 정보 조회
export const getQuestionsFromSelector = selectorFamily({
  key: "getQuestionsFromSelector",
  get: (userId) => async () => {
    return await axios.get(`${BASE_URL}/questions/from/${userId}`);
  },
});

// 특정 유저에게 보낸 질문 정보 조회
export const getQuestionsToSelector = selectorFamily({
  key: "getQuestionsToSelector",
  get: (userId) => async () => {
    return await axios.get(`${BASE_URL}/questions/to/${userId}`);
  },
});

// 질문 상세 정보 조회
export const getQuestionInfoSelector = selectorFamily({
  key: "getQuestionInfoSelector",
  get: (questionId) => async () => {
    return await axios.get(`${BASE_URL}/questions/${questionId}`);
  },
});

// 답변 정보 조회
export const getAnswerInfoSelector = selectorFamily({
  key: "getAnswerInfoSelector",
  get: (answerId) => async () => {
    return await axios.get(`${BASE_URL}/answers/${answerId}`);
  },
});
