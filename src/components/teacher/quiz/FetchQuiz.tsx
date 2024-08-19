import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { deleteQuiz } from "../../../store/QuizSlice";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../../main/spinner/Spinner";
import NoQuiz from "./NoQuiz";

// 퀴즈 조회 컴포넌트
const FetchQuiz: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // username, curricula_id, lecture_id 추출
  const { username, curricula_id, lecture_id } = useParams<{
    username: string;
    curricula_id: string;
    lecture_id: string;
  }>();

  const { status } = useSelector((state: RootState) => state.quiz);

  // store에서 quizzes 상태 가져오기
  const quizzes = useSelector((state: RootState) => state.quiz.quizzes);

  // 메뉴 여닫이 상태
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // tab 상태
  const [tab, setTab] = useState<number>(1);

  // 현재 퀴즈 id 상태
  const [quizId, setQuizId] = useState<number | null>(null);

  // 메뉴 토글 함수
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // 탭이 변경될 때마다 해당 퀴즈의 ID를 설정
  useEffect(() => {
    if (quizzes && quizzes[tab - 1]) {
      setQuizId(quizzes[tab - 1].quiz_id);
    }
  }, [tab, quizzes]);

  // 삭제 핸들러 함수
  const handleDeleteQuiz = async () => {
    // 삭제 요청
    if (quizId !== null) {
      await dispatch(deleteQuiz(quizId));
      window.location.reload();
    } else {
      console.log("quizId가 설정되지 않았습니다.");
    }
  };

  return (
    <>
      {status === "loading" && <Spinner />}
      {!quizzes?.length && status === "succeeded" && <NoQuiz />}
      {quizzes?.length && status === "succeeded" && (
        <div className="flex justify-center pt-10 pb-10 min-h-screen">
          <div className="flex flex-col justify-center p-6 w-3/5 h-3/4 bg-white border-2 border-hardBeige rounded-3xl overflow-y-auto shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex flex-row justify-between ml-0 my-auto">
                {Array.from({ length: quizzes?.length ?? 0 }, (_, i) => (
                  <div key={i}>
                    <button
                      onClick={() => setTab(i + 1)}
                      className={`text-gray-600 mt-3 py-4 px-6 font-semibold block rounded-2xl focus:outline-none ${
                        tab === i + 1
                          ? "bg-orange-200 text-white"
                          : "text-lightNavy hover:text-lightOrange"
                      }`}
                    >
                      Quiz {i + 1}
                    </button>
                  </div>
                ))}
              </div>
              <div className="hidden lg:flex space-x-4">
                <button
                  onClick={() => {
                    navigate(
                      `/teacher/profile/${username}/curricula/${curricula_id}`
                    );
                  }}
                  className="mt-3 p-3 bg-slate-400 rounded-lg text-xl font-semibold text-white hover:bg-slate-500"
                >
                  강의 목록
                </button>
                <button
                  className="mt-3 p-3 bg-blue-400 rounded-lg text-xl text-white font-semibold hover:bg-blue-600"
                  onClick={() =>
                    navigate(
                      `/teacher/profile/${username}/curricula/${curricula_id}/lecture/${lecture_id}/updateQuiz`
                    )
                  }
                >
                  수정하기
                </button>

                <button
                  className="mt-3 p-3 bg-red-400 rounded-lg text-xl text-white font-semibold hover:bg-red-600"
                  onClick={handleDeleteQuiz}
                >
                  삭제하기
                </button>
              </div>
            </div>

            <form className="mt-6">
              <div className="flex flex-col space-y-8">
                <hr className="border-4 border-hardBeige mb-2 -mt-4"></hr>
                {quizzes?.map((quiz, i) => {
                  return (
                    tab === i + 1 && (
                      <div key={i} className="w-full bg-white rounded-lg">
                        <div>
                          {/* 퀴즈 문제 */}
                          <label
                            htmlFor="question"
                            className="mt-3 mx-1 text-3xl font-bold"
                          >
                            문제
                          </label>
                          <p className="bg-veryLightOrange p-4 rounded-lg mt-4 text-xl">
                            {quiz.question}
                          </p>
                          <hr className="border-2 border-hardBeige my-10"></hr>

                          {/* 퀴즈 선택지 */}
                          <label
                            htmlFor="choiceSentence"
                            className="mt-3 mx-1 text-3xl font-bold"
                          >
                            선택지
                          </label>
                          {quiz.choices.map(
                            (choice: string, choicei: number) => (
                              <div key={choicei} className="mt-4">
                                <label className="mx-2 text-xl font-semibold">
                                  • 보기 {choicei + 1}
                                </label>
                                <p className="bg-veryLightOrange p-4 rounded-lg mt-2 text-lg">
                                  {choice}
                                </p>
                              </div>
                            )
                          )}
                          <hr className="border-2 border-hardBeige my-10"></hr>

                          {/* 정답 */}
                          <label
                            htmlFor="isAnswer"
                            className="text-3xl font-bold"
                          >
                            정답
                          </label>
                          <p className="bg-veryLightOrange p-4 rounded-lg mt-4 text-xl my-10">
                            {quiz.answers}
                          </p>
                        </div>
                      </div>
                    )
                  );
                })}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FetchQuiz;
