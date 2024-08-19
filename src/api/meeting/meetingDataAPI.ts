import axios from "axios";
import { BASE_URL, getAuthToken } from "../BASE_URL";

// Post student focus time
export const postStudentFocusTime = async (
  lecture_Id: string,
  sleepTimeData: { sleep_time: number }
) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(
      `${BASE_URL}/api/v1/studentsLectures/focus-time/${lecture_Id}`,
      sleepTimeData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Post student quiz result
export const postStudentQuizResult = async (
  quizId: number,
  quizResultData: {
    score: number;
    student_choice: string;
    student_name: string;
  }
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/v1/studentsQuizzes/${quizId}`,
      quizResultData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
