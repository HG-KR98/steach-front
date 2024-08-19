import React, { useEffect, useState } from "react";
import { FaPencilAlt, FaHistory } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import ProfileLectureHistory from "../../components/student/ProfileLectureHistory";
import UpdateMyInfo from "../../components/student/studentMyInfo/StudentMyInfo";
import StudentMyCurricula from "../../components/student/MyLecture";

const StudentProfilePage: React.FC = () => {
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
            <FaHistory className="size-8 my-2" />
            <h2 className="whitespace-nowrap">강의 히스토리</h2>
          </button>
          <button
            className={`my-2 text-lg p-3 ${
              selectedTab === 2
                ? "bg-orange-200 text-white rounded-3xl"
                : "text-lightNavy hover:text-hoverNavy"
            } flex flex-col items-center`}
            onClick={() => handleTabClick(2)}
          >
            <CgProfile className="size-8 my-2" />
            <h2 className="whitespace-nowrap">내 정보</h2>
          </button>
        </div>
      </div>
      <div className="col-span-10">
        <div className="flex">
          <div className="flex-1 p-3">
            {selectedTab === 0 && <StudentMyCurricula />}
            {selectedTab === 1 && <ProfileLectureHistory />}
            {selectedTab === 2 && <UpdateMyInfo />}
          </div>
        </div>
      </div>
      <div className="col-span-1"></div>
    </div>
  );
};

export default StudentProfilePage;
