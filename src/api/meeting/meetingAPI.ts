import axios from "axios";
import { BASE_URL } from "../BASE_URL";

// Function to start a lecture
export const startLecture = async (lectureId: number) => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/api/v1/classrooms/start/${lectureId}`,
      {},
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

export const getUpcomingLectures = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/classrooms/upcoming`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const checkClassroom = async (sessionId: string) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/classrooms/check/${sessionId}`,
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
