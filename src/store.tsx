import { configureStore } from "@reduxjs/toolkit";
import curriculaReducer from "./store/CurriculaSlice.tsx";
import studentReducer from "./store/userInfo/AuthSlice.tsx";
import lecturesListReducer from "./store/LectureSlice.tsx";
import studentProfileReducer from "./store/userInfo/StudentProfileSlice.tsx";
import teacherProfileReducer from "./store/userInfo/TeacherProfileSlice.tsx";
import mettingReducer from "./store/MeetingSlice.tsx";
import quizReducer from "./store/QuizSlice.tsx";
import searchReducer from "./store/SearchSlice.tsx";

// 중앙 스토어 설정
const store = configureStore({
  reducer: {
    curriculum: curriculaReducer,
    auth: studentReducer,
    lectures: lecturesListReducer,
    studentProfile: studentProfileReducer,
    teacherProfile: teacherProfileReducer,
    metting: mettingReducer,
    quiz: quizReducer,
    search: searchReducer,
  },
});

// RootState 타입 정의
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
