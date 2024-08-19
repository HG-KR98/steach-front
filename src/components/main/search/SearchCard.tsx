import React from "react";
import {
  Card,
  Heading,
  CardBody,
  Stack,
  Text,
  Image,
  Box,
} from "@chakra-ui/react";
import defaultImg from "../../../assets/default.png";
import { useNavigate } from "react-router-dom";
import { SearchCurricula } from "../../../interface/search/SearchInterface";

interface SearchCardProps {
  curriculum: SearchCurricula;
}

const SearchCard: React.FC<SearchCardProps> = ({ curriculum }) => {
  const navigate = useNavigate();

  return (
    <Card
      className="m-3 bg-white rounded-xl shadow overflow-hidden "
      key={curriculum.curriculum_id}
    >
      <CardBody>
        <Box className="relative">
          <button
            className="absolute inset-0 bg-black opacity-0 hover:opacity-75 transition-opacity duration-300 flex flex-col items-start"
            onClick={() => {
              navigate(`/curricula/detail/${curriculum.curriculum_id}`);
            }}
          >
            <div className="flex flex-col h-full p-2">
              <div>
                <Text className="text-white text-2xl text-left pb-2">
                  강의 소개
                </Text>
                <Text className="text-white text-lg text-left">
                  {curriculum.intro}
                </Text>
              </div>
              <Text className="text-white text-lg absolute bottom-3 right-3">
                수강 인원 {curriculum.current_attendees}/
                {curriculum.max_attendees}
              </Text>
            </div>
          </button>
          <Image
            src={
              curriculum.banner_img_url ? curriculum.banner_img_url : defaultImg
            }
            alt={curriculum.title}
            borderRadius="lg"
            onError={(e) => {
              e.currentTarget.src = defaultImg;
            }}
            className="w-full h-40"
          />
          <Stack mt="6" spacing="3" className="p-2">
            <Heading className="font-bold text-2xl overflow-hidden whitespace-nowrap text-overflow-ellipsis">
              {curriculum.title}
            </Heading>
            <Text
              className="overflow-hidden"
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 1, // 원하는 줄 수로 설정 (여기서는 3줄)
                whiteSpace: "normal",
              }}
            >
              {curriculum.intro}
            </Text>
            <Text className="text-slate-500">{curriculum.teacher_name}</Text>
          </Stack>
        </Box>
      </CardBody>
    </Card>
  );
};

export default SearchCard;
