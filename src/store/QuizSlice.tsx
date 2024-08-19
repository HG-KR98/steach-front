import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  QuizState,
  QuizCreateSendForm,
  QuizCreateReturnForm,
  QuizFetchListForm,
  QuizUpdateSendForm,
  QuizUpdateReturnForm,
} from "../interface/quiz/QuizInterface";
import {
  createQuizApi,
  fetchLectureQuizApi,
  deleteQuizApi,
  updateQuizApi,
} from "../api/lecture/quizAPI";
import axios from "axios";

// 퀴즈 초기 상태
const initialState: QuizState = {
  quizzes: null,
  status: "idle",
  error: null,
};

// 하나의 강의에 대한 퀴즈들 조회 함수
export const fetchLectureQuiz = createAsyncThunk<QuizFetchListForm, string>(
  "quiz/lecture/fetch",
  async (lectureId, thunkAPI) => {
    try {
      // 강의에 대한 퀴즈 조회 api 호출
      const response = await fetchLectureQuizApi(lectureId);

      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// 퀴즈 생성 함수
export const createQuiz = createAsyncThunk<
  QuizCreateReturnForm,
  QuizCreateSendForm
>("quiz/create", async (quizCreateData, thunkAPI) => {
  try {
    // 퀴즈 생성 api 호출
    const response = await createQuizApi(quizCreateData);

    console.log(response);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
    return thunkAPI.rejectWithValue(error);
  }
});

// 퀴즈 수정 함수
export const updateQuiz = createAsyncThunk<
  QuizUpdateReturnForm,
  QuizUpdateSendForm
>("quiz/update", async (quizUpdateData, thunkAPI) => {
  try {
    // 퀴즈 수정 api 호출
    const response = await updateQuizApi(quizUpdateData);

    console.log(response);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
    return thunkAPI.rejectWithValue(error);
  }
});

// 퀴즈 삭제 함수
export const deleteQuiz = createAsyncThunk<any, number>(
  "quiz/delete",
  async (quizId, thunkAPI) => {
    try {
      // 퀴즈 삭제 api 호출
      const response = await deleteQuizApi(quizId);

      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// 퀴즈 슬라이스
const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 강의에 대한 퀴즈 조회 addCase
      .addCase(fetchLectureQuiz.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLectureQuiz.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.quizzes = action.payload.quiz_response_dtos;
        console.log("조회 성공!");
      })
      .addCase(fetchLectureQuiz.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch lectures";
      })
      // 퀴즈 생성 addCase
      .addCase(createQuiz.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createQuiz.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(createQuiz.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch lectures";
      })
      // 퀴즈 수정 addCase
      .addCase(updateQuiz.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateQuiz.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.quizzes = action.payload.quiz_list;
      })
      .addCase(updateQuiz.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch lectures";
      })
      // 퀴즈 삭제 addCase
      .addCase(deleteQuiz.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteQuiz.fulfilled, (state) => {
        state.status = "succeeded";
        console.log("삭제 성공!");
      })
      .addCase(deleteQuiz.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch lectures";
      });
  },
});

export default quizSlice.reducer;
