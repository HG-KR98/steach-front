import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { StudentInfoUpdateForm } from "../../components/student/studentMyInfo/StudentMyInfoUpdateForm";
import {
  fetchStudentAICareerRecommendApi,
  studentInfoGet,
} from "../../api/user/userAPI";
import { studentInfoUpdate } from "../../api/user/userAPI";
import { returnStudentCurriculaList } from "../../interface/Curriculainterface";
import { getStudentCurriculaList } from "../../api/lecture/curriculumAPI";
import {
  StudentInfo,
  StudentUserInfo,
} from "../../interface/profile/StudentProfileInterface";
import axios from "axios";

// 초기 상태
const initialState: StudentUserInfo = {
  status: "",
  error: null,
  info: null,
  curricula: [],
  gptStatistic: "",
};

// 학생 정보 조회
export const fetchStudentInfo = createAsyncThunk<StudentInfo>(
  "student/get",
  async (_, thunkAPI) => {
    try {
      const response = await studentInfoGet();
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// 학생 정보 수정
export const updateStudentInfo = createAsyncThunk<
  StudentInfo,
  StudentInfoUpdateForm
>("student/patch", async (updateFormData, thunkAPI) => {
  try {
    const response = await studentInfoUpdate(updateFormData);

    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
    return thunkAPI.rejectWithValue(error);
  }
});

// 학생이 수강신청한 커리큘럼 목록 가져오기
export const getStudentCurriculas =
  createAsyncThunk<returnStudentCurriculaList>(
    "student/curricula/get",
    async (_, thunkAPI) => {
      try {
        const response = await getStudentCurriculaList();

        return response;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          return thunkAPI.rejectWithValue(error.response.data);
        }
        return thunkAPI.rejectWithValue(error);
      }
    }
  );

// gpt 진로 추천
export const fetchStudentAICareerRecommend = createAsyncThunk(
  "student/ai-recommend",
  async (_, thunkAPI) => {
    try {
      const response = await fetchStudentAICareerRecommendApi();

      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// 학생 프로필 슬라이스
const studentProfileSlice = createSlice({
  name: "studentProfile",
  initialState,
  reducers: {
    studentReset: (state) => {
      state.status = "";
      state.error = null;
      state.info = null;
      state.curricula = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // 학생 프로필 정보 get
      .addCase(fetchStudentInfo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStudentInfo.fulfilled, (state, action) => {
        state.status = "succeeded";
        const studentData: StudentInfo = {
          username: action.payload.username,
          nickname: action.payload.nickname,
          email: action.payload.email,
        };
        state.info = studentData;
      })
      .addCase(fetchStudentInfo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      // 학생 수강신청 커리큘럼 addCase
      .addCase(getStudentCurriculas.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getStudentCurriculas.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.curricula = action.payload.curricula;
      })
      .addCase(getStudentCurriculas.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      // 학생 AI 진로추천 조회
      .addCase(fetchStudentAICareerRecommend.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStudentAICareerRecommend.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.gptStatistic = action.payload;
      })
      .addCase(fetchStudentAICareerRecommend.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      });
  },
});

export const { studentReset } = studentProfileSlice.actions;

export default studentProfileSlice.reducer;
