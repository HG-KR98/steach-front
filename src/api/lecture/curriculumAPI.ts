import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  Curricula,
  CurriculaFormData,
} from "../../interface/Curriculainterface";
import axios from "axios";
import { BASE_URL, getAuthToken } from "../BASE_URL";
import { SearchSendCurricula } from "../../interface/search/SearchInterface";

const IMG_SERVER_URL = "https://steach.ssafy.io";
const Auth = localStorage.getItem("auth");

let AuthData: any;
if (Auth) {
  AuthData = JSON.parse(Auth);
} else {
  AuthData = null;
}

// img server API

// Fetch curricula list
export const fetchCurricula = async (params: {
  curriculum_category?: string;
  order?: string;
  only_available?: boolean;
  search?: string;
}) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/curricula`, {
      params: {
        curriculum_category: params.curriculum_category,
        order: params.order,
        only_available: params.only_available,
        search: params.search,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 커리큘럼 만들기
export const SignUpLecture = createAsyncThunk<Curricula, CurriculaFormData>(
  "curricula/signup",
  async (newLectureData) => {
    const token = await getAuthToken();

    const formData = new FormData();
    console.log("a");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    formData.append("userName", AuthData.username);
    formData.append("file", newLectureData.banner_img_url);
    const imgPost = await axios.post(
      `${IMG_SERVER_URL}/img-upload/upload`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("b");
    const response = await axios.post(
      `${BASE_URL}/api/v1/curricula`,
      {
        title: newLectureData.title,
        sub_title: newLectureData.sub_title,
        intro: newLectureData.intro,
        information: newLectureData.information,
        category: newLectureData.category,
        sub_category: newLectureData.sub_category,
        banner_img_url: imgPost.data.url,
        start_date: newLectureData.start_date,
        end_date: newLectureData.end_date,
        lecture_start_time: newLectureData.lecture_start_time,
        lecture_end_time: newLectureData.lecture_end_time,
        weekdays_bitmask: newLectureData.weekdays_bitmask,
        max_attendees: newLectureData.max_attendees,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data);
    return response.data;
  }
);

// [학생] 커리큘럼 수강신청
export const applyToCurriculum = async (curricula_id: string) => {
  try {
    const token = await getAuthToken();
    const response = await axios.post(
      `${BASE_URL}/api/v1/curricula/${curricula_id}/apply`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 409) {
      alert("이미 신청한 강의입니다. 다른 강의를 선택해주세요.");
    } else {
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    }
    throw error;
  }
};

// 커리큘럼 상세 보기
export const fetchCurriculumDetails = async (id: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/curricula/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 커리큘럼 상세 수정하기
export const petchCurriculumDetails = createAsyncThunk<
  Curricula,
  { newLectureData: any; id: any }
>("curricula/update", async ({ newLectureData, id }) => {
  const token = await getAuthToken();
  let bannerImgUrl;

  const formData = new FormData();
  formData.append("userName", AuthData.username);
  if (typeof newLectureData.banner_img_url === "string") {
    bannerImgUrl = newLectureData.banner_img_url;
  } else {
    formData.append("file", newLectureData.banner_img_url);
    const imgPost = await axios.post(
      `${IMG_SERVER_URL}/img-upload/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    bannerImgUrl = imgPost.data.url;
  }

  console.log(bannerImgUrl, id);
  const response = await axios.patch(
    `${BASE_URL}/api/v1/curricula/${id}`,
    {
      title: newLectureData.title,
      sub_title: newLectureData.sub_title,
      intro: newLectureData.intro,
      information: newLectureData.information,
      category: newLectureData.category,
      sub_category: newLectureData.sub_category,
      banner_img_url: bannerImgUrl,
      start_date: newLectureData.start_date,
      end_date: newLectureData.end_date,
      lecture_start_time: newLectureData.lecture_start_time,
      lecture_end_time: newLectureData.lecture_end_time,
      weekdays_bitmask: newLectureData.weekdays_bitmask,
      max_attendees: newLectureData.max_attendees,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(response.data);
  return response.data;
});

// 커리큘럼에 해당하는 강의 가져오기
export const fetchCurriculumLectures = async (curriculum_id: string) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/curricula/${curriculum_id}/lectures`
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

// 단일 커리큘럼 삭제
export const deleteCurricula = async (curriculum_id: string) => {
  try {
    const token = await getAuthToken();
    const response = await axios.delete(
      `${BASE_URL}/api/v1/curricula/${curriculum_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 학생이 수강하는 커리큘럼 조회
export const getStudentCurriculaList = async () => {
  try {
    const token = await getAuthToken();
    const response = await axios.get(`${BASE_URL}/api/v1/students/curricula`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        pageSize: 10,
        currentPageNumber: 1,
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 선생님이 강의하는 자신의 커리큘럼 조회
export const getTeacherCurriculaList = async () => {
  try {
    const token = await getAuthToken();
    const response = await axios.get(`${BASE_URL}/api/v1/teachers/curricula`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        pageSize: null,
        currentPageNumber: null,
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 학생이 볼 수 있는 선생님 수업리스트
export const TargetTeacherCurriculaList = async (teachers_id: string) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/teachers/curricula/${teachers_id}`,
      {
        params: {
          pageSize: null,
          currentPageNumber: null,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// [학생] 학생이 커리큘럼을 수강 신청 여부 확인
export const getCurriculimApply = async (curriculum_id: string) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/students/check/curriculum-apply/${curriculum_id}`,
      {
        headers: {
          Authorization: `Bearer ${AuthData.token}`,
        },
      }
    );
    return response.data.is_apply;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// [학생] 학생이 커리큘럼 수강 취소하기
export const postCurriculimCancel = async (curriculum_id: string) => {
  try {
    const token = await getAuthToken();

    const response = await axios.post(
      `${BASE_URL}/api/v1/curricula/${curriculum_id}/cancel`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// 커리큘럼 검색
export const searchCurriculaApi = async (searchData: SearchSendCurricula) => {
  const response = await axios.get(`${BASE_URL}/api/v1/curricula`, {
    params: {
      curriculum_category: searchData.curriculum_category,
      order: searchData.order,
      only_available: searchData.only_available,
      search: searchData.search,
      pageSize: searchData.pageSize,
      currentPageNumber: searchData.currentPageNumber,
    },
  });

  return response.data;
};
