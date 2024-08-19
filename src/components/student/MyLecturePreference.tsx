import React, { useEffect, useState } from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, CardHeader, CardBody, Box } from "@chakra-ui/react";
import { fetchStudentRadarChartApi } from "../../api/user/userAPI";
import { StudentRadarChart } from "../../interface/profile/StudentProfileInterface";

const MyLecturePreference: React.FC = () => {
  const [radarChartData, setRadarChartData] = useState<StudentRadarChart>({
    Korean: 0,
    Math: 0,
    Social: 0,
    Science: 0,
    Arts_And_Physical: 0,
    Engineering: 0,
    Foreign_language: 0,
  });
  const [isRadarChartData, setIsRadarChartData] = useState<boolean>(false);

  ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
  );

  const fetchSecondData = async () => {
    const response = await fetchStudentRadarChartApi();

    console.log("hihi")

    if (response) {
      setRadarChartData({
        Korean: response.Korean,
        Math: response.Math,
        Social: response.Social,
        Science: response.Science,
        Arts_And_Physical: response.Arts_And_Physical,
        Engineering: response.Engineering,
        Foreign_language: response.Foreign_language,
      });
      setIsRadarChartData(true);
    } else {
    }
  };

  useEffect(() => {
    fetchSecondData();
  }, []);

  const data = {
    labels: ["국어", "수학", "사회", "과학", "예체능", "공학", "외국어"],
    datasets: [
      {
        label: "수업 선호도",
        data: [
          radarChartData.Korean,
          radarChartData.Math,
          radarChartData.Social,
          radarChartData.Science,
          radarChartData.Arts_And_Physical,
          radarChartData.Engineering,
          radarChartData.Foreign_language,
        ],
        fill: true,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgb(255, 99, 132)",
        pointBackgroundColor: "rgb(255, 99, 132)",
        pointBorderColor: "#fff",
        pointRadius: 2,
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(255, 99, 132)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: {
        borderWidth: 1,
      },
    },
  };

  return (
    <>
      {isRadarChartData && (
        <Box className="h-full">
          <Card className="h-full">
            <CardHeader className="text-center">
              <h2 className="text-4xl font-semibold text-lightNavy">
                나의 수업 선호도
              </h2>
            </CardHeader>
            <CardBody className="flex justify-center items-center h-full">
              <Radar data={data} options={options} />
            </CardBody>
          </Card>
        </Box>
      )}
      {!isRadarChartData && (
        <div className="flex flex-col items-center align-center p-5 h-full text-center">
          <h2 className="text-4xl font-semibold text-lightNavy">
            나의 수업 선호도
          </h2>
          <p className="my-auto text-xl text-red-500">
            정보가 없습니다 ㅠㅠ 강의를 수강해주세요.
          </p>
        </div>
      )}
    </>
  );
};

export default MyLecturePreference;