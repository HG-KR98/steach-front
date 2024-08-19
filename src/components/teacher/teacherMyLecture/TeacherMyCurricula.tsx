import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { fetchTeacherCurriculaList } from "../../../store/userInfo/TeacherProfileSlice";
import { useNavigate } from "react-router-dom";
import TeacherNothingCurricula from "./TeacherNothingCurricula";
import defaultImg from "../../../assets/default.png";
import Spinner from "../../main/spinner/Spinner";

const TeacherMyCurricula: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // 페이지에 들어오면 커리큘럼 데이터를 받아오기
  useEffect(() => {
    dispatch(fetchTeacherCurriculaList());
  }, [dispatch]);

  // localStorage에 저장된 유저 정보를 가져와서 JSON으로 바꾸기
  const localStorageUserData = localStorage.getItem("auth");
  const userData = localStorageUserData
    ? JSON.parse(localStorageUserData)
    : null;

  // 저장된 커리큘럼 상태를 가져오기
  const teacherCurriculas = useSelector(
    (state: RootState) => state.teacherProfile.curricula
  );
  const status = useSelector((state: RootState) => state.teacherProfile.status);
  const error = useSelector((state: RootState) => state.teacherProfile.error);

  console.log(teacherCurriculas);
  // 한 페이지에 몇개의 커리큘럼을 나타낼지
  const ITEMS_PER_PAGE = 4;

  // 현재 페이지의 상태와 페이지를 변경하는 상태 함수
  const [currentPage, setCurrentPage] = useState(1);

  // 전체 페이지 수
  const totalPages = Math.ceil(teacherCurriculas.length / ITEMS_PER_PAGE);

  // 페이지 변경 핸들러 함수
  const handleChangePage = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // 시작 인덱스
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  // 페이지 인덱스 범위
  const selectedSamples = teacherCurriculas.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <>
      {status === "loading" && <Spinner />}
      {status === "succeeded" && teacherCurriculas.length === 0 && (
        <TeacherNothingCurricula />
      )}
      {status === "succeeded" && teacherCurriculas.length > 0 && (
        <div className="my-4 p-6 bg-white min-h-screen flex flex-col justify-between">
          <h1 className="mx-20 my-4 text-4xl font-bold text-lightNavy">
            내가 강의하는 커리큘럼
          </h1>
          <div className="flex flex-col space-y-8 mx-20 my-4">
            {selectedSamples.map((sample, index) => (
              <div
                key={index}
                className="flex border rounded-lg overflow-hidden shadow-md w-full bg-white"
              >
                <img
                  src={sample.banner_img_url}
                  alt="no-image"
                  className="w-1/3 h-56 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = defaultImg;
                  }}
                />
                <div className="p-4 flex flex-col justify-center">
                  <h2 className="text-3xl font-bold mb-2">{sample.title}</h2>
                  <p className="text-gray-700 mb-4">
                    {sample.lecture_start_time} ~ {sample.lecture_end_time}
                  </p>
                  <p>
                    인원 : {sample.current_attendees} / {sample.max_attendees}
                  </p>
                  <p className="text-gray-700 mb-4">
                    {sample.teacher_name} 선생님
                  </p>
                  <button
                    onClick={() =>
                      navigate(
                        `/teacher/profile/${userData.username}/curricula/${sample.curriculum_id}`
                      )
                    }
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 w-40"
                  >
                    자세히 보기
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 bg-white mt-3 px-4 pt-3 sm:px-6">
            <button
              onClick={() => handleChangePage(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              이전
            </button>
            <span className="text-sm text-gray-700">
              Page <span className="font-medium">{currentPage}</span> of{" "}
              <span className="font-medium">{totalPages}</span>
            </span>
            <button
              onClick={() => handleChangePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              다음
            </button>
          </div>
        </div>
      )}
      {status === "failed" && error}
    </>
  );
};

export default TeacherMyCurricula;
