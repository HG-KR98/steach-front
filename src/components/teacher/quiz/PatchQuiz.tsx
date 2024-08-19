import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import {
  QuizDetailForm,
  QuizUpdateSendForm,
} from "../../../interface/quiz/QuizInterface";
import { useParams, useNavigate } from "react-router-dom";
import { updateQuiz } from "../../../store/QuizSlice";

const PatchQuiz: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { username, curricula_id, lecture_id } = useParams<{
    username: string;
    curricula_id: string;
    lecture_id: string;
  }>();

  const quizzes = useSelector((state: RootState) => state.quiz.quizzes);

  const [tab, setTab] = useState<number>(1);

  // quizzes 배열을 quiz 상태로 설정
  const [quiz, setQuiz] = useState<QuizDetailForm[]>(quizzes || []);

  // input 입력 값 바인딩
  const handleChange = (
    index: number,
    name: string,
    value: string | number
  ) => {
    const newQuizzes = [...quiz];
    newQuizzes[index] = { ...newQuizzes[index], [name]: value };
    setQuiz(newQuizzes);
  };

  // React에서는 얕은 복사로 하면 안되고 깊은 복사로 상태를 업데이트 해야함.
  const handleChoiceChange = (
    quizIndex: number,
    choiceIndex: number,
    value: string
  ) => {
    const newQuizzes = quiz.map((q, idx) =>
      idx === quizIndex
        ? {
            ...q,
            choices: q.choices.map((choice, cIdx) =>
              cIdx === choiceIndex ? value : choice
            ),
          }
        : q
    );
    setQuiz(newQuizzes);
  };

  // 퀴즈 추가 함수
  const plusTab = () => {
    const counTab = quiz.length + 1;
    if (counTab > 4) {
      alert("최대 4개까지 추가할 수 있습니다.");
      return;
    } else {
      setQuiz([
        ...quiz,
        {
          quiz_id: 0, // 새 퀴즈에 대해 임시 ID 설정 (실제 생성 시 서버에서 할당될 수 있음)
          lecture_id: parseInt(lecture_id || "0"), // lecture_id를 가져와 할당
          quiz_number: counTab,
          choices: ["", "", "", ""],
          question: "",
          answers: 1,
          time: 5,
        },
      ]);
    }
  };

  // 퀴즈 삭제 함수
  const deleteTab = (index: number) => {
    if (quiz.length === 1) {
      alert("퀴즈는 최소 1개는 있어야 합니다.");
      return;
    }
    const newQuizzes = quiz.filter((_, i) => i !== index);
    setQuiz(newQuizzes);
    setTab(1); // 첫 번째 탭으로 이동
  };

  // 퀴즈 수정 핸들러 함수
  const handleUpdateQuiz = async () => {
    const updateData: QuizUpdateSendForm = {
      lectureId: lecture_id,
      quiz_list: quiz,
    };
    await dispatch(updateQuiz(updateData));
    navigate(
      `/teacher/profile/${username}/curricula/${curricula_id}/lecture/${lecture_id}/quiz`
    );
  };

  return (
    <div className="flex justify-center min-h-screen pt-10 pb-10">
      <div className="flex flex-col justify-center p-6 w-3/5 h-3/4 bg-white border-2 border-hardBeige rounded-3xl overflow-y-auto relative shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-row justify-between ml-0 my-auto">
            {quiz.map((_, i) => (
              <div key={i}>
                <button
                  onClick={() => setTab(i + 1)}
                  className={`text-gray-600 font-semibold py-4 px-6 mt-3 block rounded-2xl focus:outline-none ${
                    tab === i + 1
                      ? "bg-orange-200 text-white rounded-2xl"
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
                  `/teacher/profile/${username}/curricula/${curricula_id}/lecture/${lecture_id}/quiz`
                );
              }}
              className="mt-4 p-3 bg-slate-400 rounded-lg text-xl font-semibold text-white hover:bg-slate-500"
            >
              퀴즈 목록
            </button>
            <button
              onClick={plusTab}
              className="mt-4 p-3 bg-blue-400 rounded-lg text-xl font-semibold text-white hover:bg-blue-500"
            >
              퀴즈 추가
            </button>
            <button
              className="mt-4 p-3 bg-red-400 rounded-lg text-xl font-semibold text-white hover:bg-red-500"
              onClick={() => deleteTab(tab - 1)}
            >
              퀴즈 삭제
            </button>
          </div>
        </div>

        <form className="mt-6">
          <div className="flex flex-col space-y-8">
            <hr className="border-4 border-hardBeige mb-2 -mt-4"></hr>
            {quiz.map((quizItem, i) => {
              return (
                tab === i + 1 && (
                  <div key={i} className="w-full bg-white rounded-lg">
                    <div>
                      {/* 퀴즈 문제 */}
                      <label
                        htmlFor="question"
                        className="mt-3 mx-3 text-3xl font-bold"
                      >
                        문제
                      </label>
                      <input
                        type="text"
                        id="question"
                        name="question"
                        value={quizItem.question}
                        onChange={(e) =>
                          handleChange(i, "question", e.target.value)
                        }
                        className="border-2 border-veryLightOrange rounded-lg w-full p-4 mt-4 focus:outline-none focus:ring-0 focus:border-hardBeige"
                        required
                      />

                      <hr className="border-2 border-hardBeige my-10"></hr>

                      {/* 퀴즈 선택지 */}
                      <label
                        htmlFor="choiceSentence"
                        className="mt-3 mx-1 text-3xl font-bold"
                      >
                        선택지
                      </label>
                      {quizItem.choices.map((choice, choicei) => (
                        <div key={choicei} className="my-4">
                          <label className="mx-2 text-xl font-semibold">
                            • 보기 {choicei + 1}
                          </label>
                          <input
                            type="text"
                            value={choice}
                            onChange={(e) =>
                              handleChoiceChange(i, choicei, e.target.value)
                            }
                            className="border-2 border-veryLightOrange rounded-lg w-full p-4 mt-4 focus:outline-none focus:ring-0 focus:border-hardBeige"
                            required
                          />
                        </div>
                      ))}
                      <hr className="border-2 border-hardBeige my-10"></hr>

                      {/* 정답 */}
                      <label htmlFor="answers" className="text-3xl font-bold">
                        정답
                      </label>
                      <select
                        id="answers"
                        name="answers"
                        value={quizItem.answers}
                        onChange={(e) =>
                          handleChange(i, "answers", parseInt(e.target.value))
                        }
                        className="border-2 border-veryLightOrange rounded-lg p-4 mb-5 w-full mt-4 focus:outline-none focus:ring-0 focus:border-hardBeige"
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                      </select>
                      <br />
                      <div className="flex">
                        <button
                          type="button"
                          onClick={handleUpdateQuiz}
                          className="ml-auto mr-3 p-3 text-white font-semibold bg-orange-300 rounded-lg hover:bg-orange-400"
                        >
                          퀴즈 수정
                        </button>
                      </div>
                    </div>
                  </div>
                )
              );
            })}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatchQuiz;
