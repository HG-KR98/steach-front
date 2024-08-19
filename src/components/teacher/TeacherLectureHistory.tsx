import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Text,
} from "@chakra-ui/react";

const TeacherLectureHistory: React.FC = () => {
  return (
    <>
      <h1 className="text-5xl font-bold m-3">선생님의 지난 강의 내역이에요!</h1>
      <Accordion defaultIndex={[0]} allowMultiple>
        <AccordionItem>
          <h2>
            <AccordionButton className="border-2 bg-orange-300 hover:bg-orange-400">
              <Box as="span" flex="1" textAlign="left" className="p-2">
                <Text className="text-2xl">
                  [김호경의 Unity 정복하자 개발자의꿈] 1. 개발환경 세팅
                </Text>
                <Text className="text-base text-gray-600">
                  2024.07.17 17:00 ~ 2024.07.14 19:00
                </Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} className="bg-orange-200 border-2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton className="border-2 bg-orange-300 hover:bg-orange-400">
              <Box as="span" flex="1" textAlign="left" className="p-2">
                <Text className="text-2xl">
                  [김호경의 Unity 정복하자 개발자의꿈] 2. 유니티 핵심 개념
                </Text>
                <Text className="text-base text-gray-600">
                  2024.07.17 17:00 ~ 2024.07.14 19:00
                </Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} className="bg-orange-200 border-2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <h2>
            <AccordionButton className="border-2 bg-orange-300 hover:bg-orange-400">
              <Box as="span" flex="1" textAlign="left" className="p-2">
                <Text className="text-2xl">
                  [김호경의 Unity 정복하자 개발자의꿈] 3. 유니티 심화 개념
                </Text>
                <Text className="text-base text-gray-600">
                  2024.07.17 17:00 ~ 2024.07.14 19:00
                </Text>
              </Box>

              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4} className="bg-orange-200 border-2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default TeacherLectureHistory;
