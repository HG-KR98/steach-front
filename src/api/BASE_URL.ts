export const BASE_URL = "https://steach.ssafy.io";

// 토큰을 가져오는 함수
export const getAuthToken = () => {
  const userData = localStorage.getItem("auth");
  const token = userData ? JSON.parse(userData).token : "";

  return token;
};
