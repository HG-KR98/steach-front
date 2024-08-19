import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuizTestPage: React.FC = () => {
  const navigate = useNavigate();

  const handleClickButton1 = () => {
    navigate('/teacher-quiz-list-trial');
  };

  const handleClickButton2 = () => {
    navigate('/teacher-quiz-list');
  };

  const handleClickButton3 = () => {
    navigate('/student-quiz-list');
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col gap-4">
        <button
          onClick={handleClickButton1}
          className="px-4 py-2 border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded"
        >
          선생님버전 - 체험판
        </button>
        <button
          onClick={handleClickButton2}
          className="px-4 py-2 border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded"
        >
          선생님버전 - 실제상황
        </button>
        <button
          onClick={handleClickButton3}
          className="px-4 py-2 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white rounded"
        >
          학생버전 - 실제상황
        </button>
      </div>
    </div>
  );
}

export default QuizTestPage;
