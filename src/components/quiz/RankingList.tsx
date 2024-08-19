import React, { useState, useEffect } from "react";

interface Ranking {
  rank: number;
  score: number;
  name: string;
}

interface RankingsProps {
  data: {
    prev: Ranking[];
    current: Ranking[];
  };
}

const RankingsList: React.FC<RankingsProps> = ({ data }) => {
  // 이전 리스트와 애니메이션 초기 상태 설정
  const [displayedList, setDisplayedList] = useState<Ranking[]>(
    data?.prev || []
  );
  const [animatedScores, setAnimatedScores] = useState<number[]>(
    data?.prev?.map((item) => item.score) || []
  );
  const [animatedRanks, setAnimatedRanks] = useState<number[]>(
    data?.prev?.map((item) => item.rank) || []
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isTransitioning2, setIsTransitioning2] = useState(false);

  useEffect(() => {
    if (!data || !data.prev || !data.current) return;

    // current 리스트에 있는 항목 중 prev에 없었던 항목을 추가
    const newItems = data.current.filter(
      (currentItem) =>
        !data.prev.some((prevItem) => prevItem.name === currentItem.name)
    );

    if (newItems.length > 0) {
      setDisplayedList((prevList) => {
        // 중복을 방지하기 위해 기존 리스트에 없는 항목만 추가
        const updatedList = [...prevList];
        newItems.forEach((newItem) => {
          if (!updatedList.some((item) => item.name === newItem.name)) {
            updatedList.push(newItem);
          }
        });
        return updatedList;
      });
      setAnimatedScores((prevScores) => [
        ...prevScores,
        ...newItems.map((item) => 0), // 새로운 항목의 초기 점수는 0
      ]);
      setAnimatedRanks((prevRanks) => [
        ...prevRanks,
        ...newItems.map((item) => item.rank), // 새로운 항목의 초기 순위 설정
      ]);
    }

    const timeout = setTimeout(() => {
      setIsTransitioning(true); // 전환 시작
    }, 50); // 딜레이 조정 가능

    return () => clearTimeout(timeout); // 타임아웃 정리
  }, [data]);

  useEffect(() => {
    if (!isTransitioning || !data || !data.current) return;

    const duration = 500; // 총 애니메이션 시간 1초
    const intervalTime = 50; // 프레임 간격 50ms
    const totalSteps = duration / intervalTime; // 총 프레임 수

    let repeatCount1 = 0; // 반복 횟수를 추적하는 변수
    const maxRepeats1 = 10; // 최대 반복 횟수 설정

    const interval = setInterval(() => {
      setAnimatedScores((prevScores) =>
        prevScores.map((score, index) => {
          if (index >= data.current.length) {
            return score; // 범위를 넘은 경우 기존 점수를 반환
          }

          const targetScore = data.current[index].score;
          const difference = targetScore - score;
          let step = Math.ceil(difference / totalSteps); // 각 프레임에서 변화할 양

          // step이 너무 작아서 갱신이 안되는 경우를 방지하기 위해 최소값을 설정
          if (Math.abs(step) < 1) {
            step = difference >= 0 ? 1 : -1;
          }

          // 마지막 단계에서 정확하게 목표 점수로 맞추기 위한 조건
          if (Math.abs(difference) <= Math.abs(step)) {
            return targetScore; // 마지막 단계에서는 정확하게 목표 점수로 맞춤
          }

          return score + step;
        })
      );

      repeatCount1 += 1; // 반복 횟수 증가

      if (repeatCount1 >= maxRepeats1) {
        setAnimatedScores((prevScores) =>
          prevScores.map((score, index) => {
            if (index >= data.current.length) {
              return score;
            }
            return data.current[index].score; // 마지막 단계에서 모든 값을 targetScore로 설정
          })
        );
        clearInterval(interval); // 최대 반복 횟수에 도달하면 반복 중단
      }
    }, intervalTime); // 프레임 간격 50ms

    let repeatCount2 = 0; // 반복 횟수를 추적하는 변수
    const maxRepeats2 = 10; // 최대 반복 횟수 설정

    const interval2 = setInterval(() => {
      setAnimatedRanks((prevRanks) =>
        prevRanks.map((rank, index) => {
          if (index >= data.current.length) {
            return rank; // 범위를 넘은 경우 기존 점수를 반환
          }

          const targetRank = data.current[index].rank;
          const difference = targetRank - rank;
          let step = Math.ceil(difference / totalSteps); // 각 프레임에서 변화할 양

          // step이 너무 작아서 갱신이 안되는 경우를 방지하기 위해 최소값을 설정
          if (Math.abs(step) < 1) {
            step = difference >= 0 ? 1 : -1;
          }

          // 마지막 단계에서 정확하게 목표 점수로 맞추기 위한 조건
          if (Math.abs(difference) <= Math.abs(step)) {
            return targetRank; // 마지막 단계에서는 정확하게 목표 점수로 맞춤
          }

          return rank + step;
        })
      );

      repeatCount2 += 1; // 반복 횟수 증가

      if (repeatCount2 >= maxRepeats2) {
        setAnimatedScores((prevScores) =>
          prevScores.map((score, index) => {
            if (index >= data.current.length) {
              return score;
            }
            return data.current[index].score; // 마지막 단계에서 모든 값을 targetScore로 설정
          })
        );
        clearInterval(interval2); // 최대 반복 횟수에 도달하면 반복 중단
      }
    }, intervalTime); // 프레임 간격 50ms

    const timeoutId = setTimeout(() => {
      clearInterval(interval);
      clearInterval(interval2);
      setIsTransitioning2(true); // 애니메이션이 종료된 후 상태 업데이트
    }, duration); // 1초 후 애니메이션 종료

    return () => {
      clearInterval(interval);
      clearInterval(interval2);
      clearTimeout(timeoutId); // 타이머도 클리어하여 메모리 누수 방지
    };
  }, [isTransitioning, data]);

  return (
    <div
      style={{
        width: "70%",
        height: "136px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
      <ul style={{ listStyle: "none", padding: 0, margin: 0, height: "100%" }}>
        {displayedList.map((item, index) => {
          const currentRank = data.current.find(
            (currentItem) => currentItem.name === item.name
          )?.rank;
          const currentScore = data.current.find(
            (currentItem) => currentItem.name === item.name
          )?.score;
          const prevRank = item.rank;

          // 애니메이션 효과로 부드럽게 사라지게 함
          const shouldDisappear =
            isTransitioning2 &&
            (currentRank === undefined || currentScore === undefined);

          return (
            <li
              key={item.name}
              className={`mb-1 py-0 px-5 shadow-md rounded-lg border border-gray-200 transition-opacity duration-500 ${
                currentRank === 1 ? "bg-blue-300" : "bg-white"
              }`}
              style={{
                opacity: shouldDisappear ? 0 : 1,
                transition: "opacity 0.5s ease, transform 0.5s ease",
                transform:
                  isTransitioning2 &&
                  item.rank !== currentRank &&
                  currentRank !== undefined
                    ? `translateY(${34 * (currentRank - prevRank)}px)`
                    : "translateY(0)",
                color: "black",
              }}
            >
              <div className="flex items-center justify-between w-full">
                <div className="text-lg font-semibold">
                  {isTransitioning2
                    ? currentRank
                    : Math.round(animatedRanks[index])}
                  . {item.name}
                </div>
                <div className="text-sm font-semibold text-black text-right">
                  {isTransitioning2
                    ? currentScore
                    : Math.round(animatedScores[index])}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RankingsList;
