import TeacherUpdateInfoModal from "./TeacherUpdateInfoModal";
import { AppDispatch, RootState } from "../../../store";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchTeacherInfo } from "../../../store/userInfo/TeacherProfileSlice";

interface TeacherMyInfoProps {
  handleIsUpdateInfoSubmit: (password: string) => void;
}

const TeacherMyInfoForm: React.FC<TeacherMyInfoProps> = ({
  handleIsUpdateInfoSubmit,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchTeacherInfo());
  }, []);

  const teacherData = useSelector(
    (state: RootState) => state.teacherProfile.info
  );

  return (
    <div className="mx-auto my-12 p-6 w-9/12 border-2 border-hardBeige rounded-xl shadow-lg relative">
      <form>
        <h1 className="my-2 p-2 text-center text-5xl font-bold text-lightNavy">
          내정보
        </h1>
        <section className="my-4 p-2 border-b-2">
          <label className="my-2 text-3xl font-semibold text-lightNavy">
            이름
          </label>
          <p className="my-2 text-xl">{teacherData?.nickname}</p>
        </section>
        <section className="my-4 p-2 border-b-2">
          <label className="my-2 text-3xl font-semibold text-lightNavy">
            이메일
          </label>
          <p className="my-2 text-xl">{teacherData?.email}</p>
        </section>
        <section className="my-4 p-2 border-b-2">
          <label className="my-2 text-3xl font-semibold text-lightNavy">
            간단한 소개 문구
          </label>
          <p className="my-2 text-xl">
            {teacherData?.brief_introduction || "nothing"}
          </p>
        </section>
        <section className="my-4 p-2 border-b-2">
          <label className="my-2 text-3xl font-semibold text-lightNavy">
            학력
          </label>
          <p className="my-2 text-xl ">
            {teacherData?.academic_background || "nothing"}
          </p>
        </section>
        <section className="my-4 p-2 border-b-2">
          <label className="my-2 text-3xl font-semibold text-lightNavy">
            전공분야
          </label>
          <p className="my-2 text-xl">
            {teacherData?.specialization || "nothing"}
          </p>
        </section>
        <section className="my-4 p-2 border-b-2">
          <label className="my-2 text-3xl font-semibold text-lightNavy">
            봉사 시간
          </label>
          <p className="my-2 text-xl">{teacherData?.volunteer_time} 시간</p>
        </section>
      </form>
      <TeacherUpdateInfoModal
        handleIsUpdateInfoSubmit={handleIsUpdateInfoSubmit}
      />
    </div>
  );
};

export default TeacherMyInfoForm;
