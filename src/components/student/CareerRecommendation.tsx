import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchStudentAICareerRecommend } from "../../store/userInfo/StudentProfileSlice";
import {
  Card,
  CardHeader,
  CardBody,
  Stack,
  Box,
  StackDivider,
} from "@chakra-ui/react";

const CareerRecommendation: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const gptStatistic = useSelector(
    (state: RootState) => state.studentProfile.gptStatistic
  );

  // AI 진로추천 결과
  const [recommendResult, setRecommendResult] = useState<string | null>(null);

  // 진로 추천 결과를 가져오는 함수
  const getRecommendResult = async () => {
    await dispatch(fetchStudentAICareerRecommend());
    console.log(gptStatistic);
  };

  useEffect(() => {
    getRecommendResult();
  }, []);

  useEffect(() => {
    // gptStatistic이 업데이트될 때마다 recommendResult를 설정
    if (gptStatistic) {
      setRecommendResult(gptStatistic);
    }
  }, [gptStatistic]);

  return (
    <Box className="h-full">
      <Card className="p-6 h-full">
        <CardHeader>
          <h2 className="text-4xl font-semibold text-center text-lightNavy">
            AI 진로추천
          </h2>
        </CardHeader>

        <CardBody className="flex justify-center items-center mt-4 h-full">
          <Stack divider={<StackDivider />} spacing="4">
            <Box>
              {recommendResult ? (
                <p className="text-md text-center">{recommendResult}</p>
              ) : (
                <p className="text-xl text-red-500">
                  강의를 수강하여야 결과를 볼 수 있습니다.
                </p>
              )}
            </Box>
          </Stack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default CareerRecommendation;
