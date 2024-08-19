import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL, getAuthToken } from '../../../api/BASE_URL';
import { Drawer } from 'antd';
import { QuizDetailForm } from '../../../interface/quiz/QuizInterface';
import DetailQuiz from '../QuizBlock';

interface Curriculum {
  curriculum_id: number;
  teacher_name: string;
  title: string;
}

interface Lecture {
  lecture_id: number;
  lecture_title: string;
}

interface Quiz {
  quiz_id: number;
  lecture_id: number;
  quiz_number: number;
  time: number;
  question: string;
  choices: string[];
  answers: number;
}

const TeacherQuizListPage: React.FC = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [selectedLecture, setSelectedLecture] = useState<number | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [drawerLoading, setDrawerLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  

    // 퀴즈 모달
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState<QuizDetailForm | null>(
        null
    );

  // drawer 여닫기
  const [open, setOpen] = useState(false);

  const fetchQuizzes = async (lecture_id: number) => {
    const token = getAuthToken();
    try {
      setDrawerLoading(true);
      const response = await axios.get(`${BASE_URL}/api/v1/quizzes/lecture/${lecture_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setQuizzes(response.data.quiz_response_dtos);
    } catch (err) {
      setError('퀴즈 데이터를 불러오는 중에 문제가 발생했습니다.');
    } finally {
      setDrawerLoading(false);
    }
  };

// 퀴즈 모달 핸들러 함수

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedQuiz(null);
    };
    

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setQuizzes([]); // Drawer가 닫힐 때 퀴즈 데이터 초기화
  };

  useEffect(() => {
    const fetchCurriculaAndLectures = async () => {
      const token = getAuthToken();  // 토큰을 가져옴

      if (!token) {
        setError('토큰이 없습니다. 로그인하세요.');
        setLoading(false);
        return;
      }

      try {
        const curriculaResponse = await axios.get(`${BASE_URL}/api/v1/teachers/curricula`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const curricula: Curriculum[] = curriculaResponse.data.curricula;

        if (curricula.length > 0) {
          const curriculum_id = curricula[0].curriculum_id;
          const lecturesResponse = await axios.get(`${BASE_URL}/api/v1/curricula/${curriculum_id}/lectures`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const lecturesData = lecturesResponse.data.lectures;
          const lecturesList: Lecture[] = [];
          for (const week in lecturesData) {
            lecturesList.push(...lecturesData[week]);
          }
          setLectures(lecturesList);
        }
      } catch (err) {
        setError('데이터를 불러오는 중에 문제가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchCurriculaAndLectures();
  }, []);

  const handleLectureClick = (lecture_id: number) => {
    setSelectedLecture(lecture_id);
    fetchQuizzes(lecture_id); // 퀴즈 데이터를 가져옴
    showDrawer();
  };

  const handleQuizClick = (quiz: Quiz) => {
    setSelectedQuiz(quiz)
    setIsModalOpen(true)
    // 여기에 퀴즈 클릭 시 실행할 추가 로직을 작성할 수 있습니다.
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">강의 리스트</h1>
      <div className="flex flex-col gap-4 max-w-md mx-auto">
        {lectures.map((lecture) => (
          <button
            key={lecture.lecture_id}
            onClick={() => handleLectureClick(lecture.lecture_id)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-green-600 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            {lecture.lecture_title} (ID: {lecture.lecture_id})
          </button>
        ))}
      </div>

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
                {/* 선생님 실제버전 경우에는 trialVersion false, isTeacher true */}
                <DetailQuiz
                  initialQuizData={selectedQuiz}
                  onClose={handleCloseModal}
                  trialVersion={false}
                  isTeacher={true}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <Drawer
        title={`퀴즈 목록 - 강의 ID: ${selectedLecture}`}
        onClose={onClose}
        open={open}
      >
        {drawerLoading ? (
          <div>로딩 중...</div>
        ) : (
          quizzes.length > 0 ? (
            <div className="flex flex-col gap-2">
              {quizzes.map((quiz) => (
                <button
                  key={quiz.quiz_id}
                  onClick={() => handleQuizClick(quiz)}
                  className="w-full text-left bg-blue-200 text-blue-900 p-3 rounded hover:bg-blue-300 transition"
                >
                  <strong>문제 {quiz.quiz_number}:</strong> {quiz.question}
                </button>
              ))}
            </div>
          ) : (
            <div>퀴즈가 없습니다.</div>
          )
        )}
      </Drawer>
    </div>
  );
}

export default TeacherQuizListPage;
