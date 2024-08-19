import { useEffect } from "react";
import {
  Card,
  Heading,
  CardBody,
  Stack,
  Text,
  Image,
  Box,
} from "@chakra-ui/react";
import "swiper/swiper-bundle.css";
import SwiperCore from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate } from "react-router-dom";
import defaultImg from "../../assets/default.png";
import { AppDispatch, RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import {
  CurriculasState,
  getLastestLecturelist,
} from "../../store/CurriculaSlice.tsx";
import Spinner from "./spinner/Spinner";
import { Curricula } from "../../interface/Curriculainterface";

const LatestLectures: React.FC = () => {
  SwiperCore.use([Navigation, Pagination]);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const curricula = useSelector(
    (state: RootState) =>
      (state.curriculum as CurriculasState).returnLastestCurriculaList
        ?.curricula
  );
  const status = useSelector(
    (state: RootState) => (state.curriculum as CurriculasState).status
  );
  const error = useSelector(
    (state: RootState) => (state.curriculum as CurriculasState).error
  );

  useEffect(() => {
    dispatch(getLastestLecturelist());
  }, [dispatch]);

  return (
    <>
      {status === "failed" && error}
      {status === "succeeded" && (
        <section className="flex justify-center py-6">
          <Box className="container mx-16 px-16">
            <header className="text-4xl text-lightNavy font-bold m-3">
              <h1>최근 등록된 강의</h1>
            </header>
            <Box className="flex justify-center">
              <Swiper
                slidesPerView={1}
                navigation
                breakpoints={{
                  0: {
                    slidesPerView: 1,
                  },
                  640: {
                    slidesPerView: 1,
                  },
                  768: {
                    slidesPerView: 2,
                  },
                  1024: {
                    slidesPerView: 3,
                  },
                  1280: {
                    slidesPerView: 5,
                  },
                }}
                className="flex justify-center grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
              >
                {curricula && curricula.length > 0 ? (
                  curricula.map((curriculum: Curricula) => (
                    <SwiperSlide key={curriculum.curriculum_id}>
                      <Card className="m-3 bg-white rounded-xl shadow overflow-hidden">
                        <CardBody>
                          <Box className="relative">
                            <button
                              className="absolute inset-0 bg-black opacity-0 hover:opacity-75 transition-opacity duration-300 flex flex-col items-start"
                              onClick={() => {
                                navigate(
                                  `/curricula/detail/${curriculum.curriculum_id}`
                                );
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
                                curriculum.banner_img_url
                                  ? curriculum.banner_img_url
                                  : defaultImg
                              }
                              alt={curriculum.title}
                              borderRadius="lg"
                              onError={(e) => {
                                e.currentTarget.src = defaultImg;
                              }}
                              className="w-60 h-40"
                            />
                            <Stack mt="6" spacing="3" className="p-2">
                              <Heading className="font-bold text-2xl overflow-hidden whitespace-nowrap text-overflow-ellipsis truncate">
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
                              <Text className="text-slate-500">
                                {curriculum.teacher_name}
                              </Text>
                            </Stack>
                          </Box>
                        </CardBody>
                      </Card>
                    </SwiperSlide>
                  ))
                ) : (
                  <></>
                )}
              </Swiper>
            </Box>
          </Box>
        </section>
      )}
    </>
  );
};
export default LatestLectures;
