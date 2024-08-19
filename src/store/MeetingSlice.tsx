import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  LectureSeries,
  Lecture,
  PatchLecture,
} from "../interface/Curriculainterface";
import { fetchCurriculumLectures } from "../api/lecture/curriculumAPI";
import {
  postStudentFocusTime,
} from "../api/meeting/meetingDataAPI";
import axios from "axios";

interface FocusTimePayload {
  lecture_Id: string;
  sleepTimeData: { sleep_time: number };
}

export interface mettingState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// 초기 상태
const initialState: mettingState = {
  status: "idle",
  error: null,
};

// 강의 단일 정보 가져오기
export const studentFocusTime = createAsyncThunk(
  "metting/student",
  async ({lecture_Id, sleepTimeData }:FocusTimePayload, thunkAPI) => {
    try {
      const data = await postStudentFocusTime(lecture_Id, sleepTimeData );

      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const mettingSlice = createSlice({
  name: "metting",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 커리큘럼에 해당하는 강의
      .addCase(studentFocusTime.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        studentFocusTime.fulfilled,
        (state) => {
          state.status = "succeeded";
        }
      )
      .addCase(studentFocusTime.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch lectures";
      })
  },
});

export default mettingSlice.reducer;