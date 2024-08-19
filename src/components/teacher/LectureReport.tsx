import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { reportLectureSlice } from "../../store/LectureSlice";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getCurriculaDetail } from "../../store/CurriculaSlice";

const LectureReport: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { lecture_id, curricula_id } = useParams<string>();

  useEffect(() => {
    if (lecture_id && curricula_id) {
      dispatch(reportLectureSlice(lecture_id))
      dispatch(getCurriculaDetail(curricula_id))
    }
  },[dispatch])
  const report = useSelector((state: RootState) => (state.lectures.lectureReport));
  const lectures = useSelector((state: RootState) => (state.curriculum.selectlectures));

  return (
    <div className="min-h-screen">
      <div className="p-6">
        <header className="my-2 text-5xl text-indigo-900 font-semibold">
          강의 리포트
        </header>
        <div className="flex my-5 text-amber-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6 text-2xl"
          >
            <path
              fillRule="evenodd"
              d="M13.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L11.69 12 4.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
              clipRule="evenodd"
            />
            <path
              fillRule="evenodd"
              d="M19.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06L17.69 12l-6.97-6.97a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
              clipRule="evenodd"
            />
          </svg>

          <div className="text-2xl text-amber-800">
            {lectures?.title}
          </div>
        </div>
        <main>
          <section className="xl:my-12 2xl:my-14">
            <h1 className="mx-3 text-4xl text-lightNavy font-bold">
              전체 통계
            </h1>
            <div className="mx-3 my-4 size-2/6 bg-fuchsia-100 text-xl rounded-md shadow-md">
              <p className="p-3">평균 집중 시간 : {report?.average_focus_minute}분</p>
              <p className="p-3">수업 참여도 : {report?.average_focus_ratio}%</p>
              <p className="p-3">퀴즈 점수 평균 : {report?.average_total_quiz_score}점</p>
              <p className="p-3">퀴즈 정답 평균 : {report?.average_correct_number}개</p>
            </div>
          </section>
          <section className="2xl:mt-36">
            <h1 className="mx-3 text-4xl text-lightNavy font-bold">
              개별 통계
            </h1>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl: gap-4">
              {report?.student_info_by_lecture_dto_list.map((user, index) => (
                <div key={index}>
              <div className="mx-3 my-4 p-4 bg-white border-2 border-hardBeige rounded-md shadow-md">
                <p>학생 이름: {user.student_name}</p>
                    <p>수업참여도: {user.focus_ratio} %</p>
                <p>퀴즈 점수: {user.total_quiz_score}점</p>
                <p>퀴즈 정답: {user.correct_number}개</p>
              </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default LectureReport;
