import axios from "axios";
import { BASE_URL } from "../BASE_URL";
import {
  QuizCreateSendForm,
  QuizUpdateSendForm,
} from "../../interface/quiz/QuizInterface";
import { getAuthToken } from "../BASE_URL";

// 하나의 강의에 대한 퀴즈들 조회
export const fetchLectureQuizApi = async (lectureId: string) => {
  const token = getAuthToken();

  const response = await axios.get(
    `${BASE_URL}/api/v1/quizzes/lecture/${lectureId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// 퀴즈 생성
export const createQuizApi = async (quizCreateData: QuizCreateSendForm) => {
  const token = getAuthToken();

  // 강의 아이디
  const lectureId: string | undefined = quizCreateData.lectureId;

  const sendData = {
    quiz_list: quizCreateData.quiz_list,
  };

  const response = await axios.post(
    `${BASE_URL}/api/v1/quizzes/${lectureId}`,
    sendData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// 퀴즈 수정
export const updateQuizApi = async (quizUpdateData: QuizUpdateSendForm) => {
  const token = getAuthToken();

  // 강의 아이디
  const lectureId: string | undefined = quizUpdateData.lectureId;

  // 데이터 폼
  const sendData = {
    quiz_list: quizUpdateData.quiz_list,
  };

  const response = await axios.put(
    `${BASE_URL}/api/v1/quizzes/${lectureId}`,
    sendData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log("수정 성공!");
  return response.data;
};

// 퀴즈 삭제
export const deleteQuizApi = async (quizId: number) => {
  const token = getAuthToken();

  const response = await axios.delete(`${BASE_URL}/api/v1/quizzes/${quizId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("퀴즈 삭제 완료!");
  return response;
};
