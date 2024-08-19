import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { targetTeacherCurriculaList, targetTeacherInfo } from "../../store/userInfo/TeacherProfileSlice";
import defaultImg from "../../assets/default.png";
import Spinner from "../main/spinner/Spinner";

// 이진송 - 디자인 정한것에 맞춰서 짜야 함
// 디자인 이외에 구체적인건 axios 받고 해야할 듯


const TeacherInfoDetail: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(targetTeacherInfo(id));
      dispatch(targetTeacherCurriculaList(id));
    }
  }, [dispatch]);

  const teacherData = useSelector((state: RootState) => state.teacherProfile.info);
  const teacherCurriculas = useSelector((state: RootState) => state.teacherProfile.curricula);


  const status = useSelector((state: RootState) => state.teacherProfile.status);
  const error = useSelector((state: RootState) => state.teacherProfile.error);

  const localStorageUserData = localStorage.getItem("auth");
  const userData = localStorageUserData
    ? JSON.parse(localStorageUserData)
    : null;
  
  
    // 한 페이지에 몇개의 커리큘럼을 나타낼지
    const ITEMS_PER_PAGE = 5;

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
      <div className="w-9/12 bg-white border-2 border-hardBeige rounded-xl shadow-md p-6 my-12 mx-auto relative">
      <h1 className="my-2 p-2 text-center text-6xl text-lightNavy">{teacherData?.nickname} 선생님 정보</h1>
          {status === "loading" && <Spinner />}
          {status === "failed" && error}
      <div className="my-4 p-2">
        <label className="my-2 text-5xl text-lightNavy">닉네임</label>
        <p className="text-4xl">{teacherData?.nickname}</p>
      </div>
      <div className="my-4 p-2">
        <label className="my-2 text-5xl text-lightNavy">
          간단한 소개 문구
        </label>
        <p className="text-4xl">{teacherData?.brief_introduction || "nothing"}</p>
      </div>
      <div className="my-4 p-2">
        <label className="my-2 text-5xl text-lightNavy">학력</label>
        <p className="text-4xl">{teacherData?.academic_background || "nothing"}</p>
      </div>
      <div className="my-4 p-2">
        <label className="my-2 text-5xl text-lightNavy">전공분야</label>
        <p className="text-4xl">{teacherData?.specialization || "nothing"}</p>
      </div>
        <div className="flex my-4 p-2 space-x-7">
          {selectedSamples.map((sample, index) => (
            <div
            key={index}
            className=" border rounded-lg overflow-hidden shadow-md w-1/4 bg-white"
            >
            <img
              src={sample.banner_img_url}
              alt="no-image"
              className="w-screen h-56 object-cover"
              onError={(e) => {
                e.currentTarget.src = defaultImg;
              }}
              />
            <div className="p-4 flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-2 whitespace-nowrap overflow-hidden">{sample.title}</h2>
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
          <div className="flex items-center justify-between border-t border-gray-200 bg-beige mt-3 px-4 pt-3 sm:px-6">
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
  );
};

export default TeacherInfoDetail;
