import { AppDispatch, RootState } from "../../../store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchStudentInfo } from "../../../store/userInfo/StudentProfileSlice";
import CareerRecommendation from "../CareerRecommendation";
import MyLecturePreference from "../MyLecturePreference";
import StudentUpdateInfoModal from "./StudentUpdateInfoModal";

interface StudentMyInfoProps {
  handleIsUpdateInfoSubmit: (password: string) => void;
}

const StudentMyInfoForm: React.FC<StudentMyInfoProps> = ({
  handleIsUpdateInfoSubmit,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const teacherData = useSelector(
    (state: RootState) => state.studentProfile.info
  );

  useEffect(() => {
    dispatch(fetchStudentInfo());
  }, []);

  return (
    <div className="mx-auto my-12 p-6 w-9/12 min-h-screen border-2 border-hardBeige rounded-xl shadow-lg relative">
      <form>
        <header>
          <h1 className="my-2 p-2 text-center text-5xl font-bold text-lightNavy">
            내정보
          </h1>
        </header>
        <section className="my-4 p-2 border-b-2">
          <label className="my-5 text-3xl font-semibold text-lightNavy">
            닉네임
          </label>
          <p className="my-3 text-lg">{teacherData?.nickname}</p>
        </section>
        <section className="my-4 p-2 border-b-2">
          <label className="my-5 text-3xl font-semibold text-lightNavy">
            이메일
          </label>
          <p className="my-3 text-lg">{teacherData?.email}</p>
        </section>
      </form>
      <section className="flex flex-col lg:flex-row lg:h-[400px] mt-6 2xl:h-[530px]">
        <div className="mx-3 p-5 mb-6 lg:mb-0 w-full lg:w-1/2 border-2 border-hardBeige rounded-lg h-full">
          <MyLecturePreference />
        </div>
        <div className="mx-3 p-5 w-full lg:w-1/2 border-2 border-hardBeige rounded-lg h-full">
          <CareerRecommendation />
        </div>
      </section>

      <StudentUpdateInfoModal
        handleIsUpdateInfoSubmit={handleIsUpdateInfoSubmit}
      />
    </div>
  );
};

export default StudentMyInfoForm;
