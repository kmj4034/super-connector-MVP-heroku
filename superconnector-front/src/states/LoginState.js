import axios from "axios";
import { atom, selector } from "recoil";
import { recoilPersist } from "recoil-persist";

const BASE_URL = process.env.BASE_URL;

export const checkLoggedIn = selector({
  key: "checkLoggedIn",
  get: async () => {
    return await axios.get(`${BASE_URL}/auth/checkLoggedIn`);
  },
});

const { persistAtom } = recoilPersist();

export const LoginState = atom({
  key: "LoginState",
  default: false,
  effects_UNSTABLE: [persistAtom],
});

// 로그인 정보
export const loginInfo = atom({
  key: "loginInfo",
  default: {},
  effects_UNSTABLE: [persistAtom],
});

// 답변자 등록 여부
export const isEnrolled = atom({
  key: "isEnrolled",
  default: false,
  effects_UNSTABLE: [persistAtom],
});
