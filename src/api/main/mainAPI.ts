import axios from "axios";
import { BASE_URL } from "../BASE_URL";

// const instance = axios.create({
//     baseURL: 'https://api.example.com',
//     headers: {'Authorization': `Bearer ${token}`}
//   });

// Fetch curricula list
export const fetchLatestCurricula = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/curricula`, {
      params: {
        order: "LATEST",
        only_available: true,
        pageSize: 7,
        currentPageNumber: 1,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchPopularCurricula = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/curricula`, {
      params: {
        order: "POPULAR_PER_RATIO",
        only_available: true,
        pageSize: 7,
        currentPageNumber: 1,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
