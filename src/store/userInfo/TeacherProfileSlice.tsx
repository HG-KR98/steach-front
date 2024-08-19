import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { targetTeacherInfoGet, teacherInfoGet } from "../../api/user/userAPI";
import { teacherInfoUpdate } from "../../api/user/userAPI";
import { TeacherInfoUpdateForm } from "../../components/teacher/teacherMyInfo/TeacherMyInfoUpdateForm";
import axios from "axios";
import {
  TeacherInfo,
  TeacherUserInfo,
} from "../../interface/profile/TeacherProfileInterface";
import {
  TargetTeacherCurriculaList,
  getTeacherCurriculaList,
} from "../../api/lecture/curriculumAPI";
import { returnTeacherCurriculaList } from "../../interface/Curriculainterface";

// 초기 상태
const initialState: TeacherUserInfo = {
  status: "",
  error: null,
  info: null,
  curricula: [],
};

// 선생님 내정보 조회
export const fetchTeacherInfo = createAsyncThunk<TeacherInfo>(
  "teacher/get",
  async (_, thunkAPI) => {
    try {
      const response = await teacherInfoGet();
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// 선생님 내정보 수정
export const updateTeacherInfo = createAsyncThunk<
  TeacherInfo,
  TeacherInfoUpdateForm
>("teacher/patch", async (updateFormData, thunkAPI) => {
  try {
    const response = await teacherInfoUpdate(updateFormData);

    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
    return thunkAPI.rejectWithValue(error);
  }
});

// 선생님이 진행하는 커리큘럼 리스트 조회
export const fetchTeacherCurriculaList =
  createAsyncThunk<returnTeacherCurriculaList>(
    "teacher/curricula/get",
    async (_, thunkAPI) => {
      try {
        const response = await getTeacherCurriculaList();

        return response;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          return thunkAPI.rejectWithValue(error.response.data);
        }
        return thunkAPI.rejectWithValue(error);
      }
    }
  );

// 학생이 볼 수 있는 선생님 과목
export const targetTeacherCurriculaList = createAsyncThunk<
  returnTeacherCurriculaList,
  string
>("teacher/curricula/get", async (id, thunkAPI) => {
  try {
    const response = await TargetTeacherCurriculaList(id);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
    return thunkAPI.rejectWithValue(error);
  }
});

// 학생이 볼 수 있는 선생님 프로필
export const targetTeacherInfo = createAsyncThunk<TeacherInfo, string>(
  "teacher/get",
  async (id, thunkAPI) => {
    try {
      const response = await targetTeacherInfoGet(id);

      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// 선생님 프로필 슬라이스
const teacherprofileSclice = createSlice({
  name: "teacherProfle",
  initialState,
  reducers: {
    teacherReset: (state) => {
      state.status = "";
      state.error = null;
      state.info = null;
      state.curricula = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // 선생님 프로필 정보 get
      .addCase(fetchTeacherInfo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTeacherInfo.fulfilled, (state, action) => {
        state.status = "succeeded";
        const teacherData: TeacherInfo = {
          username: action.payload.username,
          nickname: action.payload.nickname,
          email: action.payload.email,
          volunteer_time: action.payload.volunteer_time,
          brief_introduction: action.payload.brief_introduction,
          academic_background: action.payload.academic_background,
          specialization: action.payload.specialization,
        };
        state.info = teacherData;
      })
      .addCase(fetchTeacherInfo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      // 선생님 정보 정보 수정
      .addCase(updateTeacherInfo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateTeacherInfo.fulfilled, (state, action) => {
        state.status = "succeeded";
        const teacherData: TeacherInfo = {
          username: action.payload.username,
          nickname: action.payload.nickname,
          email: action.payload.email,
          volunteer_time: action.payload.volunteer_time,
          brief_introduction: action.payload.brief_introduction,
          academic_background: action.payload.academic_background,
          specialization: action.payload.specialization,
        };
        state.info = teacherData;
      })
      .addCase(updateTeacherInfo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      })
      // 선생님이 진행하는 커리큘럼 리스트 조회
      .addCase(fetchTeacherCurriculaList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTeacherCurriculaList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.curricula = action.payload.curricula;
      })
      .addCase(fetchTeacherCurriculaList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || null;
      });
  },
});

export const { teacherReset } = teacherprofileSclice.actions;

export default teacherprofileSclice.reducer;
