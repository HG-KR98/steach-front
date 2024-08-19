import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { Lecture } from "../../../interface/Curriculainterface";
import {
  AccordionPanel,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  Box,
  Text,
} from "@chakra-ui/react";
import {
  CurriculasState,
  getCurriculaDetail,
  getCurriculaLectureList,
} from "../../../store/CurriculaSlice";
import defaultImg from "../../../assets/default.png";
import TeacherMyLectureListButton from "./TeacherMyLectureListButton";
import DeleteModal from "../../main/modal/DeleteModal";
import Spinner from "../../main/spinner/Spinner";

const TeacherMyLectureList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // curricula_id 추출
  const { username, curricula_id } = useParams<{
    username: string;
    curricula_id: string;
  }>();

  // 커리큘럼 단일 상태를 조회
  const lectures = useSelector(
    (state: RootState) => (state.curriculum as CurriculasState).selectlectures
  );

  const status = useSelector(
    (state: RootState) => (state.curriculum as CurriculasState).status
  );

  // 단일 커리큘럼에 대한 강의 리스트 상태를 조회
  const lectureslist = useSelector(
    (state: RootState) => (state.curriculum as CurriculasState).lectureslist
  );

  // 페이지에 들어왔을때 curricula_id를 이용하여 함수 실행하기
  useEffect(() => {
    const getCurricula = async () => {
      if (curricula_id) {
        await dispatch(getCurriculaDetail(curricula_id));
        dispatch(getCurriculaLectureList(curricula_id));
      }
    };
    getCurricula();
  }, [curricula_id, dispatch]);

  // 디데이 계산 함수
  const calculateDaysAgo = (dateString: string) => {
    const targetDate = new Date(dateString);
    const today = new Date(new Date().toISOString().slice(0, 10));
    const difference = today.getTime() - targetDate.getTime();
    return Math.floor(difference / (1000 * 60 * 60 * 24)); // 밀리초를 일 단위로 변환
  };

  return (
    <div className="grid grid-cols-12 min-h-screen">
      <div className="col-span-1"></div>
      <div className="col-span-10">
        <div className="p-9 bg-white relative">
          <header className="text-5xl font-bold text-indigo-900">
            내 커리큘럼 {">"} {lectures?.title}
          </header>
          <div className="absolute right-20">
            <button
              className="mx-2 p-3 rounded-md bg-violet-300 text-white font-semibold shadow-md hover:bg-violet-400"
              onClick={() => navigate(`update`)}
            >
              커리큘럼 수정
            </button>
            {/* 모달을 이용하여 삭제 */}
            <DeleteModal purpose="curricula" />
          </div>
          <section className="flex items-center my-7">
            <img
              src={lectures?.banner_img_url || defaultImg}
              alt="no-image"
              className="mx-3 w-72 h-48 rounded-md shadow-md"
              onError={(e) => (e.currentTarget.src = defaultImg)}
            />
            <main className="mx-4">
              <h1 className="my-3 text-3xl">{lectures?.sub_title}</h1>
              <p className="text-md text-slate-500">
                {lectures?.start_date} ~ {lectures?.end_date}
              </p>
              <p className="text-md text-slate-500">
                {lectures?.lecture_start_time} ~ {lectures?.lecture_end_time}
              </p>
            </main>
          </section>
          {status === "loading" && <Spinner />}
          <section className="mx-3 mt-12 mb-3 border-gray-300 p-4">
            <h1 className="my-5 text-4xl text-lightNavy font-semibold">
              강의목록
            </h1>
            <Accordion className="shadow-lg" defaultIndex={[]} allowMultiple>
              {Array.from(
                { length: lectureslist?.week_count ?? 0 },
                (_, index) => (
                  <AccordionItem
                    key={index}
                    className="rounded-lg"
                    sx={{
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      marginBottom: "10px",
                      overflow: "hidden",
                    }}
                  >
                    <AccordionButton className="bg-gray-200 hover:bg-gray-300">
                      <Box as="span" flex="1" textAlign="left" className="p-2">
                        <Text className="text-2xl font-bold">
                          &nbsp; {index + 1}주차 강의
                        </Text>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4} className="p-3 bg-white">
                      {lectureslist?.lectures[index + 1].map(
                        (lecture: Lecture, index2: number) => {
                          const daysAgo = calculateDaysAgo(
                            lecture.lecture_start_time.slice(0, 10)
                          );
                          return (
<div
                              key={index2}
                              className="grid grid-cols-4 border-b-2 border-gray-400 pt-1"
                            >
                              <div className="col-span-2">
                                <h2 className="text-xl font-semibold">
                                  {lecture.lecture_title}
                                </h2>
                                <p>
                                  {daysAgo > 0 || lecture.is_completed
                                    ? `종료된 강의입니다.`
                                    : daysAgo < 0 && !lecture.is_completed
                                    ? `${-daysAgo}일 후 강의가 있습니다.`
                                    : "오늘 강의입니다."}
                                </p>
                              </div>
                              <div className="flex col-span-1 md:justify-left lg:justify-end">
                                <header>
                                  <p>강의 날짜 : </p>
                                  <p>시작 시간 : </p>
                                  <p>종료 시간 : </p>
                                </header>
                                <main>
                                  <p>
                                    {lecture.lecture_start_time.slice(0, 10)}
                                  </p>
                                  <p>
                                    {lecture.lecture_start_time.slice(11, 16)}
                                  </p>
                                  <p>
                                    {lecture.lecture_end_time.slice(11, 16)}
                                  </p>
                                </main>
                              </div>
                              <div className="flex justify-center items-center col-span-1">
                                {daysAgo > 0 || lecture.is_completed ? (
                                  <TeacherMyLectureListButton
                                    lectureState={"completed"}
                                    lectureId={lecture.lecture_id}
                                    curriculaId={curricula_id}
                                    username={username}
                                  />
                                ) : daysAgo < 0 && !lecture.is_completed ? (
                                  <TeacherMyLectureListButton
                                    lectureState={"scheduled"}
                                    lectureId={lecture.lecture_id}
                                    curriculaId={curricula_id}
                                    username={username}
                                  />
                                ) : (
                                  <TeacherMyLectureListButton
                                    lectureState={"ongoing"}
                                    lectureId={lecture.lecture_id}
                                    curriculaId={curricula_id}
                                    username={username}
                                  />
                                )}
                              </div>
                              <hr />
                            </div>
                          );
                        }
                      )}
                    </AccordionPanel>
                  </AccordionItem>
                )
              )}
            </Accordion>
          </section>
        </div>
      </div>
      <div className="col-span-1"></div>
    </div>
  );
};

export default TeacherMyLectureList;
