import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  LectureSeries,
  Lecture,
  PatchLecture,
  StudentQuizDto,
  StudentInfoByLectureDto,
  LectureReport,
} from "../interface/Curriculainterface";
import { fetchCurriculumLectures } from "../api/lecture/curriculumAPI";
import {
  getLectureDetailApi,
  patchLectureDetailApi,
  startLecture,
  reportLecture,
  fetchFinalLectureDetails,
} from "../api/lecture/lectureAPI";
import axios from "axios";

// 이진송
// 강의 상태 인터페이스
export interface LecturesState {
  lectureslist: LectureSeries | null;
  lecture: Lecture | null;
  lectureReport: LectureReport | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// 초기 상태
const initialState: LecturesState = {
  lectureslist: null,
  lecture: null,
  lectureReport: null,
  status: "idle",
  error: null,
};

// 강의 리스트 가져오기
export const getLecturelist = createAsyncThunk<LectureSeries, string>(
  "lectures/list",
  async (id) => {
    const data = await fetchCurriculumLectures(id);
    return data;
  }
);

// 강의 단일 정보 가져오기
export const getLectureDetail = createAsyncThunk(
  "lectures/getDetail",
  async (lectureId: number, thunkAPI) => {
    try {
      const data = await getLectureDetailApi(lectureId);

      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// 강의 단일 정보 수정하기
export const patchLectureDetail = createAsyncThunk<Lecture, PatchLecture>(
  "lectures/patchDetail",
  async (lectureData: PatchLecture, thunkAPI) => {
    try {
      // 데이터 수정 함수 호출
      const data = await patchLectureDetailApi(lectureData);
      console.log(data);

      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// 강의 시작하기
export const startLectureSlice = createAsyncThunk(
    "lectures/start",
    async (lectureId: string, thunkAPI) => {
      try {
        const data = await startLecture(lectureId);
  
        return data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          return thunkAPI.rejectWithValue(error.response.data);
        }
        return thunkAPI.rejectWithValue(error);
      }
    }
);


// 강의 report 전송(강사전용)
export const reportLectureSlice = createAsyncThunk<LectureReport, string>(
    "lectures/report",
    async (lectureId: string, thunkAPI) => {
      try {
        const data = await reportLecture(lectureId);
  
        return data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          return thunkAPI.rejectWithValue(error.response.data);
        }
        return thunkAPI.rejectWithValue(error);
      }
    }
);
  
// 강의 수업 종료 전송(강사전용)
export const finalLectureSlice = createAsyncThunk<LectureReport, string>(
    "lectures/final",
    async (lectureId: string, thunkAPI) => {
      try {
        const data = await fetchFinalLectureDetails(lectureId);
  
        return data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          return thunkAPI.rejectWithValue(error.response.data);
        }
        return thunkAPI.rejectWithValue(error);
      }
    }
);
  


// 강의 슬라이스
const lecturesSlice = createSlice({
  name: "lecture",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 커리큘럼에 해당하는 강의
      .addCase(getLecturelist.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        getLecturelist.fulfilled,
        (state, action: PayloadAction<LectureSeries>) => {
          state.status = "succeeded";
          state.lectureslist = action.payload;
        }
      )
      .addCase(getLecturelist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch lectures";
      })
      // 강의 단일 조회 addCase
      .addCase(getLectureDetail.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        getLectureDetail.fulfilled,
        (state, action: PayloadAction<Lecture>) => {
          state.status = "succeeded";
          state.lecture = action.payload;
        }
      )
      .addCase(getLectureDetail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch lectures";
      })
      // 강의 시작하기 addCase
      .addCase(startLectureSlice.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        startLectureSlice.fulfilled,
        (state) => {
          state.status = "succeeded";
        }
      )
      .addCase(startLectureSlice.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch lectures";
      })
      // 강의 report addCase
      .addCase(reportLectureSlice.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        reportLectureSlice.fulfilled,
        (state, action) => {
          state.status = "succeeded";
          state.lectureReport = action.payload;
        }
      )
      .addCase(reportLectureSlice.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch lectures";
      })
      // 강의 종료 final addCase
      .addCase(finalLectureSlice.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        finalLectureSlice.fulfilled,
        (state, action) => {
          state.status = "succeeded";
          state.lectureReport = action.payload;
        }
      )
      .addCase(finalLectureSlice.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch lectures";
      });
  },
});

export default lecturesSlice.reducer;