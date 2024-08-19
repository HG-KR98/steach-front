import React, { useEffect, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import TeacherMyInfo from "../../components/teacher/teacherMyInfo/TeacherMyInfo";
import TeacherMyCurricula from "../../components/teacher/teacherMyLecture/TeacherMyCurricula";

// 선생님 페이지
const TeacherProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(20);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY + 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleTabClick = (tab: number) => {
    setSelectedTab(tab);
  };

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-1"></div>
      <div className="relative">
        <div className="p-2 relative flex">
          <div
            className="top-auto w-auto h-auto border-2 border-hardBeige rounded-3xl font-semibold flex flex-col items-center mr-2 p-2 bg-white"
            style={{
              position: "absolute",
              top: `${scrollPosition}px`,
              transition: "top 0.3s ease",
            }}
          >
            <button
              className={`my-2 text-lg p-3 ${
                selectedTab === 0
                  ? "bg-orange-200 text-white rounded-3xl"
                  : "text-lightNavy hover:text-hoverNavy"
              } flex flex-col items-center`}
              onClick={() => handleTabClick(0)}
            >
              <FaPencilAlt className="size-8 my-2" />
              <h2 className="whitespace-nowrap">내 커리큘럼</h2>
            </button>
            <button
              className={`my-2 text-lg p-3 ${
                selectedTab === 1
                  ? "bg-orange-200 text-white rounded-3xl"
                  : "text-lightNavy hover:text-hoverNavy"
              } flex flex-col items-center`}
              onClick={() => handleTabClick(1)}
            >
              <CgProfile className="size-8 my-2" />
              <h2 className="whitespace-nowrap">내 정보</h2>
            </button>
            <button
              onClick={() => window.location.replace("/lecture/signup")}
              className="my-2 text-lg p-3 bg-red-200 rounded-md shadow-md text-white hover:bg-red-300 flex flex-col items-center whitespace-nowrap"
            >
              커리큘럼 생성
            </button>
          </div>
        </div>
      </div>
      <div className="col-span-10">
        <div className="flex-1 p-3">
          {selectedTab === 0 && <TeacherMyCurricula />}
          {selectedTab === 1 && <TeacherMyInfo />}
        </div>
      </div>
      <div className="col-span-1"></div>
    </div>
  );
};

export default TeacherProfilePage;
