import React, { useState, useEffect } from "react";
import axios from "axios";
import "./goUp.css";
import QuizChoiceButton from "./QuizChoiceButton";
import { BASE_URL } from "../../api/BASE_URL";
import StatisticsChart from "./StatisticsChart";
import maruGif from "./toktokmaru.gif";
import { getAuthToken } from "../../api/BASE_URL";
import { QuizDetailForm } from "../../interface/quiz/QuizInterface";

interface StatisticData {
  statistics: number[];
}

export interface RankData {
  rank: number;
  score: number;
  name: string;
}

export interface StatisticRankData {
  prev: RankData[];
  current: RankData[];
}

export interface ApiResponse {
  statistics: number[];
  prev: RankData[];
  current: RankData[];
}

interface DetailQuizProps {
  initialQuizData: QuizDetailForm;
  onClose: () => void;
  trialVersion?: boolean;
  isTeacher: boolean;
}

const DetailQuiz: React.FC<DetailQuizProps> = ({
  initialQuizData,
  onClose,
  trialVersion,
  isTeacher
}) => {
  const [showChoices, setShowChoices] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

  const [statisticData, setStatisticData] = useState<StatisticData | null>(
    null
  );
  const [statisticRankData, setStatisticRankData] =
    useState<StatisticRankData | null>(null);

  const realTime = initialQuizData.time; 
  const [timer, setTimer] = useState<number>(
    realTime !== undefined ? realTime : initialQuizData.time
  ); // 타이머 시간

  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [showMyResult, setShowMyResult] = useState<boolean>(false);
  const [showStatistic, setShowStatstic] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [finishGetData, setFinishGetData] = useState<boolean>(false);

  //이미 푼 퀴즈 에러창
  const [alreadyTakenQuizModal, setAlreadyTakenQuizModal] = useState(false);

  const token = getAuthToken();

  const tmpStatisticRankData = {
    "prev": [
      {
        "rank": 1,
        "score": 10,
        "name": "호두마루"
      },
      {
        "rank": 2,
        "score": 0,
        "name": "감자마루"
      },
      {
        "rank": 3,
        "score": 0,
        "name": "딸기마루"
      },
      {
        "rank": 4,
        "score": 0,
        "name": "초코마루"
      }
    ],
    "current": [
      {
        "rank": 1,
        "score": 90,
        "name": "초코마루"
      },
      {
        "rank": 2,
        "score": 50,
        "name": "감자마루"
      },
      {
        "rank": 3,
        "score": 10,
        "name": "호두마루"
      },
      {
        "rank": 4,
        "score": 0,
        "name": "딸기마루"
      }
    ]
  }

  const savePrevRankDataToLocalStorage = (rankData: RankData[]): void => {
    try {
      const serializedData = JSON.stringify(rankData);
      localStorage.setItem('prevRankData', serializedData);
    } catch (error) {
      console.error("Error saving rank data to localStorage", error);
    }
  }; //로컬스토리지 저장 함수

  const getPrevRankDataFromLocalStorage = (): RankData[] | null => {
    try {
      const serializedData = localStorage.getItem('prevRankData');
      if (serializedData === null) {
        return null;
      }
      return JSON.parse(serializedData) as RankData[];
    } catch (error) {
      console.error("Error getting rank data from localStorage", error);
      return null;
    }
  }; //로컬스토리지에서 꺼내오는 함수
  
  useEffect(() => {
    if (showStatistic) {
      // 통계 불러오기
      axios
        .get<ApiResponse>(
          `${BASE_URL}/api/v1/quizzes/${initialQuizData?.quiz_id}/statistic`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // 필요한 경우 헤더에 인증 정보 추가
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          setStatisticData({ statistics: response.data.statistics }); // 데이터 설정
          
          let prev = getPrevRankDataFromLocalStorage();

          console.log("&&&&&&&&&&&#########++++++++++++===================")
          console.log(prev);
          console.log(response.data.current)
          console.log("&&&&&&&&&&&#########++++++++++++===================")
          
          const rankData = {
            prev: prev ?? response.data.current, // prev가 null이면 response.data.current 사용
            current: response.data.current,
          };
  
          setStatisticRankData(rankData);
  
          savePrevRankDataToLocalStorage(response.data.current);
        })
        .catch((error) => {
          console.error("Error fetching statistic data:", error);
        })
        .finally(() => {
          setFinishGetData(true); // 데이터 로드 완료 표시
        });
    }
  }, [showStatistic, initialQuizData]);

  useEffect(() => {
    const emojiTimer = setTimeout(() => {
      setStartAnimation(true);
    }, 1500);

    const questionTimer = setTimeout(() => {
      setShowQuestion(true);
      if (isTeacher && !trialVersion) {
        setIsClicked(true);
        setSelectedChoice(initialQuizData.answers - 1); //자동으로 정답처리
      }
    }, 2500);

    const choicesTimer = setTimeout(() => {
      setIsVisible(false);
      setShowChoices(true);

      const countdownTimer = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer > 1) {
            return prevTimer - 1;
          } else {
            clearInterval(countdownTimer);
            setShowAnswer(true);
            setIsClicked(true);
            setShowMyResult(true);
            setShowModal(true);
            return 0;
          }
        });
      }, 1000);
    }, 4000);

    return () => {
      clearTimeout(questionTimer);
      clearTimeout(choicesTimer);
      clearTimeout(emojiTimer);
    };
  }, []);

  useEffect(() => {
    if (showModal) {
      const timeoutId = setTimeout(() => {
        setShowModal(false);
        setShowStatstic(true);
      }, 1000);

      // 타이머 정리
      return () => clearTimeout(timeoutId);
    }
  }, [showModal]);

  const handleChoiceClick = (choice: number) => {
    setSelectedChoice(choice);

    //선택지 문자열
    const choiceSentence = initialQuizData.choices[choice];

    // 타이머 시작 후 몇 초가 지났는지 계산
    // const elapsedSeconds = initialQuizData.time - timer; // 초기 타이머 값이 3이므로, 현재 타이머 값(timer)으로부터 경과 시간을 계산

    let score = 0;

    //틀렸을 때 0점처리
    if (choice === initialQuizData.answers - 1) {
      score = Math.round((timer * 100) / initialQuizData.time);
    }

    console.log("점수는 " + score + "점!");

    //statistic axios
    if (trialVersion || isTeacher) {
      //pass
    } else {
      //선택지 클릭했을 때
      axios
        .post(
          `${BASE_URL}/api/v1/studentsQuizzes/` + initialQuizData.quiz_id,
          {
            score: score,
            student_choice: choiceSentence,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .catch((error) => {
          if (error.response) {
            //이미 푼 퀴즈인 경우
            if (error.response.status === 400) {
              setAlreadyTakenQuizModal(true)

              // 1초 후 모달 숨김
              setTimeout(() => {
                setAlreadyTakenQuizModal(false);
              }, 1000);
            }
          }
          console.error(
            "There was an error sending the statistics data!",
            error
          );
        });
    }

    setIsClicked(true);
  };

  if (!initialQuizData) {
    return <div>Loading...</div>;
  }

  // 타이머에 따라 색상 결정
  //: timer ===4 ? 'bg-lime-400'
  const clockColor =
    timer <= 0
      ? "bg-zinc-500"
      : timer === 1
      ? "bg-red-600"
      : timer === 2
      ? "bg-amber-400"
      : timer === 3
      ? "bg-yellow-400"
      : "bg-blue-600";
  //파 초 노 주 빨
  return (
    <div
      id="quizContainer"
      className="relative w-[500px] h-[400px] text-center font-sans flex flex-col justify-start"
      style={{ backgroundColor: "rgb(242, 242, 242)" }}
    >
      {/* <span className="close-button" onClick={onClose}>&times;</span>   빼도됨 */}
      <div className="relative h-[200px] flex-1">
        <div style={{ height: "50px" }} />
        <div id="quizEmoji" style={styles.quizEmoji}>
          {isVisible && (
            <div>
              <img
                src={maruGif}
                alt="Animated GIF"
                title="퀴즈가 시작됩니다!"
                style={{
                  ...styles.emoji,
                  ...(startAnimation ? styles.animate : {}),
                }}
              />
            </div>
          )}
        </div>

        {/* 이미 퀴즈를 풀었다 블록 */}
        {alreadyTakenQuizModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-green-300 text-black p-4 rounded-lg shadow-lg">
              이미 푼 퀴즈입니다.
            </div>
          </div>
        )}

        {/* 타이머 블록 */}
        <div
          id="clock"
          className={`absolute top-[5%] left-3 ml-0 opacity-0 text-white text-center transition-opacity duration-500 w-[40px] h-[40px] leading-[40px] rounded-full ${clockColor} ${
            showChoices && !showStatistic ? "opacity-100" : "opacity-0"
          }`}
          style={{}}
        >
          <p>{timer}</p>
        </div>

        {/* 통계(선지당 선택개수, 퀴즈점수 순위) 블록 */}
        <div
          id="statistic"
          className={`absolute top-[70%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 text-white text-center transition-opacity duration-500 w-full h-[50px] flex items-center justify-center ${
            showStatistic ? "opacity-70" : "opacity-0"
          }`}
        >
          {statisticRankData  && finishGetData && (
            <div className="w-full">
              <StatisticsChart
                dataset={
                  trialVersion?
                    { statistics: [5, 1, 0, 4] }: //체험판 더미 데이터
                    statisticData ? statisticData : { statistics: [0, 0, 0, 0] } //TODO undefined 에러..
                }
                rankData={trialVersion? tmpStatisticRankData : statisticRankData}
              />
            </div>
          )}
        </div>

        {/* 맞았습니다 틀렸습니다 블록 */}
        {(!isTeacher || trialVersion) && (
          <div
            id="result"
            className={`absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 text-white text-center transition-opacity duration-500 w-[150px] h-[50px] rounded-lg flex items-center justify-center z-50 ${
              showModal && showMyResult && !showStatistic
                ? "opacity-100"
                : "opacity-0"
            } ${
              selectedChoice === initialQuizData.answers - 1
                ? "bg-blue-300"
                : "bg-red-300"
            }`}
          >
            <p>
              {selectedChoice === initialQuizData.answers - 1
                ? "맞았습니다"
                : "틀렸습니다"}
            </p>
          </div>
        )}

      {/* 퀴즈 질문 블록 */}
      <div
        id="question"
        className={`absolute inset-0 top-[50px] text-2xl transition-transform duration-500 ease-in-out flex justify-center items-end pb-2 ${
          showQuestion ? "opacity-100" : "opacity-0"
        } transform ${
          showStatistic
            ? "translate-y-[-145px]"
            : showChoices
            ? "translate-y-[-45px]"
            : "translate-y-0"
        }`}
      >
        <p
          style={{
            backgroundColor: "",
            padding: 10,
            width: "100%",
            fontSize: initialQuizData.question.length >= 100 
              ? "14px" 
              : initialQuizData.question.length >= 50 
              ? "18px" 
              : "24px",  // Default larger size for shorter questions
            lineHeight: initialQuizData.question.length >= 50 
              ? "1.2" 
              : initialQuizData.question.length >= 20 
              ? "1.4" 
              : "1.6",  // Adjust line spacing based on length
            textAlign: "center"  // Ensure text is centered
          }}
        >
          {initialQuizData.question}
        </p>
      </div>


      </div>

      <div
        id="answer"
        style={{
          ...styles.choices,
          ...(showChoices ? styles.show : styles.hide),
        }}
      >
        {initialQuizData.choices.map((choice, index) => {
          const isCorrectChoice = index + 1 === initialQuizData.answers;

          return (
            <QuizChoiceButton
              key={index}
              choiceSentence={choice}
              isCorrectChoice={isCorrectChoice}
              isClicked={isClicked}
              selectedChoice={selectedChoice}
              showAnswer={showAnswer}
              onClick={handleChoiceClick}
              index={index} 
            />
          );
        })}
      </div>
      {/* 4문항 미만일 때 반응형 만들기(2-> 1, 1-> 1) */}
      {initialQuizData.choices.length < 3 &&
        Array.from({ length: Math.ceil(initialQuizData.choices.length/2) }).map((_, idx) => (
          <div key={`placeholder-${idx}`} style={{ visibility: 'hidden' }}>
            <QuizChoiceButton
              choiceSentence=""
              isCorrectChoice={false}
              isClicked={false}
              selectedChoice={null}
              showAnswer={false}
              onClick={() => {}}
              index={initialQuizData.choices.length + idx + 1} // continuing the index
            />
          </div>
        ))}
      <div style={{ height: "5px" }} />
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  quizEmoji: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  shrink: {
    transform: "translateY(-45px)",
  },
  choices: {
    marginTop: "auto",
    opacity: 0,
    transition: "opacity 0.5s ease-in-out",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
  },
  show: {
    opacity: 1,
  },
  hide: {
    opacity: 0,
  },
  emoji: {
    width: "300px",
    height: "300px",
    transition:
      "transform 2s ease-in-out, opacity 2s ease-in-out, font-size 2s ease-in-out",
    transform: "translateY(0)",
  },
  animate: {
    transform: "scale(0.2)",
    opacity: 0, // 추가된 부분: 애니메이션 시 투명해짐
    transition: "transform 1.5s ease-in-out, opacity 1s ease-in-out", // 투명도에 대한 트랜지션 추가
  },
};

export default DetailQuiz;
