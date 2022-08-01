import axios from "axios";

const BASE_URL = process.env.BASE_URL;

export async function getUserInfo(snsId) {
  const res = await axios.get(`${BASE_URL}/user/${snsId}`);
  return res.data;
}

export const getLogInData = async () => {
  const res = await axios.get(`${BASE_URL}/user`);
  return res.data;
};
