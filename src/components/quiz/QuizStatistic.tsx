// QuizStatistic.tsx
import React from 'react';

interface QuizStatisticButtonProps {
  choice: string;
  isCorrectChoice: boolean;
  isClicked: boolean;
  selectedChoice: string | null;
  showAnswer: boolean;
  onClick: (choice: string) => void;
  index: number; // 숫자를 받아오기 위한 props
}

const QuizStatistic: React.FC<QuizStatisticButtonProps> = ({
  choice,
  isCorrectChoice,
  isClicked,
  selectedChoice,
  showAnswer,
  onClick,
  index,
}) => {
  const getChoiceColor = (choice: string) => {
    switch (index) {
      case 0:
        return { backgroundColor: 'rgb(208, 53, 66)' };
      case 1:
        return { backgroundColor: 'rgb(45, 106, 199)' };
      case 2:
        return { backgroundColor: 'rgb(208, 159, 54)' };
      case 3:
        return { backgroundColor: 'rgb(67, 132, 38)' };
      default:
        return { backgroundColor: 'gray' };
    }
  };

  const getIcon = (index: number) => {
    switch (index) {
      case 0:
        return '♥'; // 사각형
      case 1:
        return '♠'; // 삼각형
      case 2:
        return '◆'; // 원형
      case 3:
        return '♣'; // 다이아몬드
      default:
        return '';
    }
  };

  return (
    <button
      onClick={() => onClick(choice)}
      style={{
        fontSize: '18px',
        padding: '10px 20px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        height: '70px',
        position: 'relative',
        borderRadius: '3px',
        margin: '3px',
        backgroundColor: isClicked
          ? selectedChoice !== choice
            ? getChoiceColor(choice).backgroundColor
            : getChoiceColor(choice).backgroundColor
          : getChoiceColor(choice).backgroundColor,
        color: 'white',
        opacity: !isClicked
          ? 1
          : !showAnswer
          ? selectedChoice !== choice
            ? 0.2
            : 1
          : selectedChoice !== choice && !isCorrectChoice
          ? 0.2
          : 1,
        textAlign: 'left',
        paddingLeft: '10px',
      }}
      disabled={selectedChoice !== null}
    >
      <span style={{ marginRight: '10px' }}>{getIcon(index)}</span>
      {choice}
      {showAnswer && (
        <span className="absolute right-2 top-1/2 transform -translate-y-1/2 font-bold">
          {isCorrectChoice ? 'O' : 'X'}
        </span>
      )}
    </button>
  );
};

export default QuizStatistic;
