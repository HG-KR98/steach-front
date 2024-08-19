import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Text,
} from "@chakra-ui/react";
import { BASE_URL, getAuthToken } from "../../api/BASE_URL";
import noHistoryImg from "../../assets/noHistory.png";

interface LectureHistoryItem {
  curriculum_name: string;
  lecture_name: string;
  lecture_start_time: string;
  lecture_end_time: string;
  average_focus_ratio: number;
  average_focus_minute: number;
  quiz_score: number;
  total_quiz_score: number;
  quiz_correct_number: number;
  quiz_total_count: number;
}

const ProfileLectureHistory: React.FC = () => {
  const [lectureHistory, setLectureHistory] = useState<LectureHistoryItem[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = getAuthToken();
    axios
      .get(`${BASE_URL}/api/v1/lectures/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data.history);
        setLectureHistory(response.data.history);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching lecture history:", error);
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      {!isLoading && !lectureHistory && (
        <div className="flex justify-center">
          <img className="size-3/5" src={noHistoryImg} alt="no-img" />
        </div>
      )}
      {isLoading && !lectureHistory && <p>Loading...</p>}
      {!isLoading && lectureHistory && (
        <div className="mx-8 my-10 min-h-screen">
          <h1 className="my-4 text-4xl text-lightNavy font-bold">
            지난 강의 내역이에요!
          </h1>
          <Accordion className="shadow-lg" defaultIndex={[0]} allowMultiple>
            {lectureHistory.map((lecture, index) => (
              <AccordionItem className="rounded-lg" key={index}>
                <h2>
                  <AccordionButton className="bg-hardBeige hover:bg-darkerBeige">
                    <Box as="span" flex="1" textAlign="left" className="p-2">
                      <Text className="text-2xl">
                        [{lecture.curriculum_name}] {lecture.lecture_name}
                      </Text>
                      <Text className="text-base text-gray-600">
                        {lecture.lecture_start_time} ~{" "}
                        {lecture.lecture_end_time} 2024.07.14 19:00
                      </Text>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4} className="p-3 bg-white">
                  <div className="grid grid-cols-2">
                    <div>
                      <h2 className="text-2xl">강의 참여도</h2>
                      <Text>
                        집중도: {lecture.average_focus_ratio}% (총{" "}
                        {lecture.average_focus_minute}분)
                      </Text>
                    </div>
                    <div>
                      <h2 className="text-2xl">퀴즈 통계</h2>
                      <Text>
                        점수: {lecture.quiz_score} / {lecture.total_quiz_score}
                      </Text>
                      <Text>
                        정답 수: {lecture.quiz_correct_number} /{" "}
                        {lecture.quiz_total_count}
                      </Text>
                    </div>
                  </div>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </>
  );
};

export default ProfileLectureHistory;
