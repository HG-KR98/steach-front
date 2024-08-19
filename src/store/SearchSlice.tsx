import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { searchCurriculaApi } from "../api/lecture/curriculumAPI";
import {
  SearchSendCurricula,
  SearchReturnCurricula,
  SearchCurriculaState,
} from "../interface/search/SearchInterface";
import axios from "axios";

// 커리큘럼 검색 초기 상태
const initialState: SearchCurriculaState = {
  total_page: 0,
  curricula: [],
  status: "idle",
  error: null,
};

// 커리큘럼 검색
export const searchCurricula = createAsyncThunk<
  SearchReturnCurricula,
  SearchSendCurricula
>("curricula/search", async (searchData, thunkAPI) => {
  try {
    const data = await searchCurriculaApi(searchData);

    console.log("검색 성공!", searchData);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
    return thunkAPI.rejectWithValue(error);
  }
});

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 커리큘럼 검색 조회
      .addCase(searchCurricula.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchCurricula.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.curricula = action.payload.curricula;
        state.total_page = action.payload.total_page;
      })
      .addCase(searchCurricula.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch lectures";
      });
  },
});

export default searchSlice.reducer;
