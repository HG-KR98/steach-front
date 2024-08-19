import React, { useState, useEffect } from "react";
import { Drawer, FloatButton } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { fetchLectureQuiz } from "../../store/QuizSlice";
import {
  AudioMutedOutlined,
  AudioOutlined,
  EllipsisOutlined,
  QuestionCircleOutlined,
  WechatOutlined,
} from "@ant-design/icons";
import DetailQuiz from "./QuizBlock";
import { QuizDetailForm } from "../../interface/quiz/QuizInterface";
import { QuizState } from "../../interface/quiz/QuizInterface";

const QuizDrawer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // drawer 여닫기
  const [open, setOpen] = useState(false);

  // 마이크 음소거 여부
  const [isMicroPhoneMute, setIsMicroPhoneMute] = useState(false);

  // 소리 음소거 여부
  const [isAudioMute, setIsAudioMute] = useState(false);

  // 화면 출력 여부
  const [isOnVideo, setIsOnVideo] = useState(false);

  // 퀴즈 모달
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizDetailForm | null>(
    null
  );

	const { status } = useSelector((state: RootState) => (state.quiz as QuizState));
  const quzzies = useSelector((state: RootState) => (state.quiz as QuizState).quizzes);

  // Drawer 여는 함수
  const showDrawer = () => {
    if (open) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  // Drawer 닫는 함수
  const onClose = () => {
    setOpen(false);
  };

  // 마이크 음소거 여부 핸들러 함수
  const handleIsMicroPhoneMute = () => {
    if (isMicroPhoneMute) {
      setIsMicroPhoneMute(false);
    } else {
      setIsMicroPhoneMute(true);
    }
  };

  // 소리 음소거 여부 핸들러 함수
  const handleIsAudioMute = () => {
    if (isAudioMute) {
      setIsAudioMute(false);
    } else {
      setIsAudioMute(true);
    }
  };

  // 자신의 화면 출력 여부 핸들러 함수
  const handleIsOnVideo = () => {
    if (isOnVideo) {
      setIsOnVideo(false);
    } else {
      setIsOnVideo(true);
    }
  };

  // 퀴즈 모달 핸들러 함수

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedQuiz(null);
  };

  //모달켜지기
  const handleButtonClick = (quiz: QuizDetailForm) => {
    setSelectedQuiz(quiz);
    setIsModalOpen(true);
    setOpen(false);
  };

  // 이 drawer을 켰을 때 퀴즈 리스트를 불러오기
  useEffect(() => {
    dispatch(fetchLectureQuiz("6576"));
  }, []);

  return (
    <>
      {/* 마이크 소리 화면공유 etc */}
      {/* 마이크 아이콘 */}
      <section>
        {isMicroPhoneMute && (
          <FloatButton
            onClick={handleIsMicroPhoneMute}
            icon={<AudioMutedOutlined />}
            type="default"
            style={{ top: 160, left: 16 }}
          />
        )}
        {!isMicroPhoneMute && (
          <FloatButton
            onClick={handleIsMicroPhoneMute}
            icon={<AudioOutlined />}
            type="default"
            style={{ top: 160, left: 16 }}
          />
        )}
        {/* 소리 아이콘 */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
        />
        </svg>

        {isAudioMute && (
          <button
            onClick={handleIsAudioMute}
            className="fixed top-60 left-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
              />
            </svg>
          </button>
        )}
        {!isAudioMute && (
          <button
            onClick={handleIsAudioMute}
            className="fixed top-60 left-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
              />
            </svg>
          </button>
        )}
        {/* 화면 아이콘 */}
        {isOnVideo && (
          <button
            onClick={handleIsOnVideo}
            className="fixed top-60 left-14 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
          </button>
        )}
        {!isOnVideo && (
          <button
            onClick={handleIsOnVideo}
            className="fixed top-60 left-14 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M12 18.75H4.5a2.25 2.25 0 0 1-2.25-2.25V9m12.841 9.091L16.5 19.5m-1.409-1.409c.407-.407.659-.97.659-1.591v-9a2.25 2.25 0 0 0-2.25-2.25h-9c-.621 0-1.184.252-1.591.659m12.182 12.182L2.909 5.909M1.5 4.5l1.409 1.409"
              />
            </svg>
          </button>
        )}

        {/* 화면 공유 아이콘 */}

        {/* 퀴즈 및 채팅 버튼 그룹 */}
        <FloatButton.Group
          trigger="hover"
          type="primary"
          style={{ top: 160, left: 116 }}
          icon={<EllipsisOutlined />}
        >
          <FloatButton
            
            icon={<QuestionCircleOutlined />}
            type="default"
            style={{ top: 120, left: 36 }}
            onClick={showDrawer}
          />

          <FloatButton
            
            icon={<WechatOutlined />}
            type="default"
            style={{ top: 120, left: 36 }}
            onClick={showDrawer}
          />
          <FloatButton />
        </FloatButton.Group>
      </section>

      {isModalOpen && selectedQuiz && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-[500px] relative">
            {/* Close Button Overlapping DetailQuiz */}
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition text-2xl z-10"
            >
              &times;
            </button>

            {/* DetailQuiz Component Centered */}
            <div className="flex justify-center items-center">
              <div className="rounded-lg overflow-hidden w-full">
                <DetailQuiz
                  initialQuizData={selectedQuiz}
                  onClose={handleCloseModal}
                  trialVersion={false}
                  isTeacher={false}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="h-screen">
        <Drawer
          title="퀴즈 목록"
          onClose={onClose}
          open={open}
          mask={false}
          loading={status === "loading"}
        >
          {/* Drawer가 열릴 때만 section 컴포넌트를 생성 */}
          {open && (
            <section>
              {quzzies?.map((quiz, index) => {
                console.log(quiz);
                return (
                  <>
                    <button
                      key={quiz.quiz_id}
                      onClick={() => handleButtonClick(quiz)}
                      className="w-full text-left bg-blue-200 text-white p-2 mb-2 rounded hover:bg-blue-600 transition"
                    >
                      Quiz {quiz.quiz_number} - {quiz.question}
                    </button>
                    
                  </>
                );
              })}
            </section>
          )}
        </Drawer>
      </section>

    </>
  );
};

export default QuizDrawer;
