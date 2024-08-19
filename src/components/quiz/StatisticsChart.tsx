import React, { useState, useEffect } from 'react';
import ChartRow from './ChartRow';
import { Button } from 'antd';
import RankingsList from './RankingList';
import { StatisticRankData } from './QuizBlock';

interface StatisticsChartProps {
  dataset: { statistics: number[] };
  rankData: StatisticRankData
}

const StatisticsChart: React.FC<StatisticsChartProps> = ({ dataset, rankData }) => {
  const [showRankings, setShowRankings] = useState(false);
  const [showNext, setShowNext] = useState(false);

  useEffect(() => {
    // 2초 후에 showRankings를 true로 설정
    const timer = setTimeout(() => {
      setShowRankings(true);
      console.log(rankData === null)
      console.log(rankData?.prev)
      console.log(rankData?.current)
    }, 2000);

    // 타이머를 정리하여 메모리 누수를 방지
    return () => clearTimeout(timer);
  }, []);

  const handleButtonClick = () => {
    setShowRankings(true);
  };

  const handleButtonClick2 = () => {
    setShowRankings(false);
    setShowNext(true);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {showRankings && (
        <Button style={{ width: 30, margin: 2 }} onClick={handleButtonClick2}>
          {"<"}
        </Button>
      )}
      <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
        {!showRankings ? (
          <ChartRow data={dataset.statistics} />
        ) : (
          <RankingsList key={Date.now()} data={rankData} />
          // <RankingsList key={Date.now()} data={rankData ? rankData : data} //연동 코드 /> 
        )}
      </div>
      {showNext && !showRankings && (
        <Button style={{ width: 30, margin: 2 }} onClick={handleButtonClick}>
          {">"}
        </Button>
      )}
    </div>
  );
};

export default StatisticsChart;
