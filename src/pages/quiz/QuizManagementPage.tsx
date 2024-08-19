import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState, AppDispatch } from "../../store";
import { fetchLectureQuiz } from "../../store/QuizSlice";
import NoQuiz from "../../components/teacher/quiz/NoQuiz";
import FetchQuiz from "../../components/teacher/quiz/FetchQuiz";
import { createSelector } from "@reduxjs/toolkit";

//  quizzes가 매번 새로운 참조를 가진 배열로 반환된다면 불필요한 재렌더링이 발생할 수 있다. 이를 방지하기 위해 선택기(selector) 함수를 메모이제이션해야 한다.
const quizzes = (state: RootState) => state.quiz;

export const selectQuizzes = createSelector(
  [quizzes],
  (quizState) => quizState.quizzes || []
);

// 퀴즈 관리 페이지
const QuizManagementPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { lecture_id } = useParams<{ lecture_id: string }>();

  // 하나의 강의에 대한 퀴즈 정보 불러오기
  useEffect(() => {
    if (lecture_id) {
      dispatch(fetchLectureQuiz(lecture_id));
    }
  }, [dispatch, lecture_id]);

  return <>{quizzes.length > 0 ? <FetchQuiz /> : <NoQuiz />}</>;
};

export default QuizManagementPage;
