import React from 'react';

interface QuizChoiceButtonProps {
  isCorrectChoice: boolean;
  choiceSentence: string;
  isClicked: boolean;
  selectedChoice: number | null;
  showAnswer: boolean;
  onClick: (choice: number) => void;
  index: number; // 숫자를 받아오기 위한 props
}

const QuizChoiceButton: React.FC<QuizChoiceButtonProps> = ({
  isCorrectChoice,
  choiceSentence,
  isClicked,
  selectedChoice,
  showAnswer,
  onClick,
  index,
}) => {
  const getChoiceColor = (choice: number) => {
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
        return '▲'; // 사각형
      case 1:
        return '◆'; // 삼각형
      case 2:
        return '●'; // 원형
      case 3:
        return '■'; // 다이아몬드
      default:
        return '';
    }
  };

  // Determine the font size based on the length of the choiceSentence
  let fontSize;
  if (choiceSentence.length >= 32) {
    fontSize = '13px';
  } else if (choiceSentence.length >= 20) {
    fontSize = '14px';
  } else if (choiceSentence.length >= 12) {
    fontSize = '16px';
  } else {
    fontSize = '18px';
  }

  return (
    <button
      onClick={() => onClick(index)}
      style={{
        fontSize: fontSize,
        padding: '10px 20px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        height: '70px',
        position: 'relative',
        borderRadius: '3px',
        margin: '3px',
        backgroundColor: isClicked
          ? selectedChoice !== index
            ? getChoiceColor(index).backgroundColor
            : getChoiceColor(index).backgroundColor
          : getChoiceColor(index).backgroundColor,
        color: 'white',
        opacity: !isClicked
          ? 1
          : !showAnswer
          ? selectedChoice === index
            ? 1
            : 0.2
          : selectedChoice === index || isCorrectChoice
          ? 1
          : 0.2,
        textAlign: 'left',
        paddingLeft: '10px',
      }}
      disabled={selectedChoice !== null}
    >
      <span style={{ marginRight: '10px' }}>{getIcon(index)}</span>
      {choiceSentence}
      {showAnswer && (
        <span className="absolute right-2 top-1/2 transform -translate-y-1/2 font-bold">
          {isCorrectChoice ? 'O' : 'X'}
        </span>
      )}
    </button>
  );
};

export default QuizChoiceButton;
