import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  getCurriculaLectureList,
  getCurriculaDetail,
  applyCurricula,
  applyCurriculaCheck,
  CurriculaCancel,
  CurriculasState,
} from "../../store/CurriculaSlice.tsx";
import { getLecturelist } from "../../store/LectureSlice.tsx";
import { Lecture } from "../../interface/Curriculainterface.tsx";
import img1 from "../../../src/assets/checked.jpg";
import img2 from "../../../src/assets/unchecked.jpg";
import img3 from "../../../src/assets/human.png";
import { Modal } from "antd";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Text,
} from "@chakra-ui/react";
import defaultImg from "../../assets/default.png";
import Spinner from "../main/spinner/Spinner";
import DOMPurify from 'dompurify'
// import Markdown from "../main/Markdown.tsx";

const sanitizedData = (htmlString: string) => ({
  __html: htmlString ? DOMPurify.sanitize(htmlString) : 'error'
})

// function decodeHtml(html) {
//   const text = document.createElement("textarea");
//   text.innerHTML = html;
//   return text.value;
// }

const LectureDetail: React.FC = () => {
  // 이진송
  const userDataString = localStorage.getItem("auth");
  const userData = userDataString ? JSON.parse(userDataString) : null;

  const [_, setToday] = useState("");
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  // const [lectureDescription, setLectureDescription] = useState('');
  const [lectureDescription, setLectureDescription] = useState<{ __html: string }>({ __html: '' });
  const lectures = useSelector((state: RootState) => (state.curriculum as CurriculasState).selectlectures);
  const lectureslist = useSelector((state: RootState) => (state.curriculum as CurriculasState).lectureslist);

  const isApply = useSelector((state: RootState) => (state.curriculum as CurriculasState).isApply);
  const status = useSelector((state: RootState) => (state.curriculum as CurriculasState).status);
  const error = useSelector((state: RootState) => (state.curriculum as CurriculasState).error);

  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const showLoading = () => {
    setOpen(true);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const bitday = lectures?.weekdays_bitmask.split("");
  const url = lectures?.banner_img_url;

  useEffect(() => {
    if (id) {
      dispatch(getLecturelist(id));
      dispatch(getCurriculaDetail(id));
      dispatch(getCurriculaLectureList(id));
      userData &&
        userData.role === "STUDENT" &&
        dispatch(applyCurriculaCheck(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${
      currentDate.getMonth() + 1
    }-${currentDate.getDate()}`;
    setToday(formattedDate);
  }, []);

  useEffect(() => {
    if(lectures?.information){
      setLectureDescription(sanitizedData(lectures?.information));
    }
  }, [lectures]);

  async function applyCurriculaBtn() {
    if (id) {
      await dispatch(applyCurricula(id));
      window.location.reload();
    }
  }

  async function cancelCurriculaBtn() {
    if (id) {
      await dispatch(CurriculaCancel(id));
      window.location.reload();
    }
  }

  let startLecture: any;
  const calculateDaysAgo = (dateString: string): number => {
    const targetDate = new Date(dateString);
    const today = new Date(new Date().toISOString().slice(0, 10));
    const difference = today.getTime() - targetDate.getTime();
    return Math.floor(difference / (1000 * 60 * 60 * 24)); // 밀리초를 일 단위로 변환
  };


  console.log('raw Data: ', lectures?.information);
  return (
    <>
      <header className="flex bg-gray-800 text-white text-left py-2.5 justify-center">
        <div className="w-3/5">
          <div>
            <p>
              {lectures?.category} &gt; {lectures?.sub_category}
            </p>
            <h1 className="text-7xl p-3">{lectures?.title}</h1>
            <p className="p-1">{lectures?.sub_title}</p>
            <p className="p-1">{lectures?.intro}</p>
            <Link to={`/teacher/profiledetail/${lectures?.teacher_id}`}>
              <div className="flex items-center">
                <img src={img3} className="w-10 h-10 m-5" />
                <span>
                  {lectures?.teacher_name} 선생님
                </span>
              </div>
            </Link>
          </div>
        </div>
        <div className="mt-60 mr-10"></div>
        <div className="w-1/5">
          <div>
            <img
              src={url}
              className="w-60 h-60"
              alt="no-image"
              onError={(e) => (e.currentTarget.src = defaultImg)}
            />
          </div>
        </div>
      </header>
      <div className="bg-white grid grid-cols-12">
        <div className="hidden lg:col-span-1 lg:block"></div>
        <div className="lg:col-span-6 col-span-8 bg-white p-4">
          <br className="text-black"></br>
          <ul className="flex lg:flex-row text-lg font-bold ml-4">
            <li className="mr-5 mb-10">
              <a href="#intro" className="hover:text-orange-300">
                강의 소개
              </a>
            </li>
            <li className="mr-5 mb-10">
              <a href="#day" className="hover:text-orange-300">
                강의 요일
              </a>
            </li>
            <li className="mr-5 mb-10">
              <a href="#curriculum" className="hover:text-orange-300">
                커리큘럼
              </a>
            </li>
          </ul>
          <div className="whitespace-pre-line break-words">
            <h1 className="text-5xl" id="intro">
              강의 소개
            </h1>
            <style>{`
            
              .lecture-content{
                font-weight: revert;
                margin: 2em 1em 2em 1em;
                padding: 3em;
                border-radius: 20px;
                // padding: 3em 2em 3em 2em;
                background: #f2f2f2;
              }
            
              .lecture-content ul, .lecture-content ol {
                padding-left: 20px;
                list-style: revert;
              }
              
              .lecture-content h1, h2, h3, h4, h5, h6 {
                font-weight: 700;
                font-size: revert;
              }
              
              blockquote {
                max-width: 100%;
                margin: 0.5rem auto;
                padding: 0.5rem 1.5rem;
                background: #fff;
                border-left: 6px solid #b8b8b8;
                &::before, &::after{
                  position: absolute;
                  left: 0;
                  font-size: 1rem;
                  color: #b8b8b8;
                }
              }`
            }</style>
            <div className="lecture-content" dangerouslySetInnerHTML={lectureDescription}/>
          </div>
          <h1 className="text-5xl pt-10" id="day">
            강의 요일
          </h1>
          <div className="flex justify-center p-5">
            {bitday?.map((a: string, i: number) => {
              // 인덱스에 해당하는 요일 배열
              const daysOfWeek = ["월", "화", "수", "목", "금", "토", "일"];
              const day = daysOfWeek[i % 7]; // 인덱스를 요일로 변환

              return (
                <div key={i} className="px-2 relative inline-block">
                  {a === "1" ? (
                    <img src={img1} className="w-20 h-20" />
                  ) : (
                    <img src={img2} className="w-20 h-20" />
                  )}
                  <span
                    style={{
                      position: "absolute",
                      top: "55%",
                      left: "48%",
                      transform: "translate(-50%, -50%)",
                      color: "black",
                      fontWeight: "bold",
                      fontSize: "20px",
                      pointerEvents: "none",
                    }}
                  >
                    {day}
                  </span>
                </div>
              );
            })}
          </div>
          <h1 className="text-5xl py-10" id="curriculum">
            커리큘럼
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
                      <Text className="text-2xl">
                        [{lectures?.title}] {index + 1}주차 강의
                      </Text>
                    </Box>

                    {/* <Text className="text-base text-gray-600">
                          {daysAgo > 0 ? `이미 끝난 강의입니다.` : daysAgo < 0 ? `${-daysAgo}일 후 강의입니다.` : '오늘 강의입니다.'}
                        </Text> */}
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4} className="p-3 bg-white">
                    {lectureslist?.lectures[index + 1].map(
                      (lecture:Lecture, index2:number) => {
                        const daysAgo = calculateDaysAgo(
                          lecture.lecture_start_time.slice(0, 10)
                        );
                        return (
                          <div
                            key={index2}
                            className="grid grid-cols-4 border-b-2 border-gray-400 pt-1"
                          >
                            <div className="col-span-2">
                              <h2 className="text-xl">
                                {lecture.lecture_title}
                              </h2>
                              <p>
                                {daysAgo > 0
                                  ? `종료된 강의입니다.`
                                  : daysAgo < 0
                                  ? `${-daysAgo}일 후 강의가 있습니다.`
                                  : "오늘 강의입니다."}
                              </p>
                            </div>
                            <div className="flex col-span-1 text-right md:justify-left lg:justify-end">
                              <header>
                                <p>강의 날짜 : </p>
                                <p>시작 시간 : </p>
                              </header>
                              <main>
                                <p>{lecture.lecture_start_time.slice(0, 10)}</p>
                                <p>
                                  {lecture.lecture_start_time.slice(11, 19)}
                                </p>
                              </main>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </AccordionPanel>
                </AccordionItem>
              )
            )}
            {status === "loading" && <Spinner />}
          </Accordion>
          <div></div>
        </div>
        <div className="sticky top-24 lg:right-24 xl:right-44 right-0 h-96 w-96 bg-white ml-10 mt-3 p-4 flex flex-col rounded-lg border-2 border-gray-400">
          <h3 className="text-3xl font-bold ml-4 mb-4 text-red-600">무료</h3>
          <h3 className="text-2xl font-bold mb-4">{lectures?.title}</h3>
          {userData &&
          userData.role === "TEACHER" &&
          userData.nickname === lectures?.teacher_name ? (
            <button
              className="w-full mb-5 py-2 px-4 bg-gray-500 text-white font-bold rounded self-center"
              onClick={() => {
                navigate(`/teacher/profile/${userData.username}/curricula/${id}/update`);
              }}
            >
              수정하기
            </button>
          ) : userData && userData.role === "TEACHER" && userData.nickname ? (
            <button
              className="w-full mb-5 py-2 px-4 bg-gray-500 text-white font-bold rounded self-center"
              disabled
            >
              수강 신청은 학생만 가능합니다.
            </button>
          ) : isApply === false ? (
            <button
              className="w-full mb-5 py-2 px-4 bg-pink-500 hover:bg-pink-700 text-white font-bold rounded self-center"
              onClick={showLoading}
            >
              수강 신청
            </button>
          ) : (
            <button
              className="w-full mb-5 py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded self-center"
              onClick={showLoading}
            >
              수강 취소
            </button>
          )}
          <Modal
            title={<p>수강 신청</p>}
            footer={
              isApply === false ? (
                <button
                  className="w-full mb-5 py-2 px-4 bg-pink-500 hover:bg-pink-700 text-white font-bold rounded self-center"
                  onClick={applyCurriculaBtn}
                >
                  수강신청
                </button>
              ) : (
                <button
                  className="w-full mb-5 py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded self-center"
                  onClick={cancelCurriculaBtn}
                >
                  수강취소
                </button>
              )
            }
            loading={loading}
            open={open}
            onCancel={() => setOpen(false)}
          >
            <div className="flex justify-center">
              <img
                src={url}
                className="w-60 h-60 m-10 border-4 border-pink-500 rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2">
              <div>
                <ul>
                  <li>지식공유자</li>
                  <li>총 강의수</li>
                  <li>분류</li>
                  <li>현재 수강 인원</li>
                  <li>수료증 발급 유무</li>
                </ul>
              </div>
              <div>
                <span className="hidden">
                  {(startLecture = calculateDaysAgo(lectures?.start_date ?? "default-date"))}
                </span>
                <ul>
                  <li>{lectures?.teacher_name} 강사님</li>
                  <li>{lectureslist?.lecture_count}개 강의</li>
                  <li>{lectures?.category}</li>
                  <li>
                    {lectures?.current_attendees} / {lectures?.max_attendees}
                  </li>
                  <li>발급</li>
                </ul>
              </div>
            </div>
          </Modal>
          <div className="grid grid-cols-2">
            <div>
              <ul>
                <li>지식공유자</li>
                <li>총 강의수</li>
                <li>분류</li>
                <li>현재 수강 인원</li>
                <li>수료증 발급 유무</li>
              </ul>
            </div>
            <div>
              <span className="hidden">
                {(startLecture = calculateDaysAgo(lectures?.start_date ?? "default-date"))}
              </span>
              <ul>
                <li>{lectures?.teacher_name} 선생님</li>
                <li>{lectureslist?.lecture_count}개 강의</li>
                <li>{lectures?.category}</li>
                <li>
                  {lectures?.current_attendees} / {lectures?.max_attendees}
                </li>
                <li>발급</li>
              </ul>
            </div>
          </div>
          <p className="text-center mt-auto text-xl ">
            {startLecture > 0
              ? `이미 ${startLecture}일 전에 강의가 시작했어요!`
              : startLecture < 0
              ? `${-startLecture}일 후에 시작하는 강의에요!`
              : "오늘부터 시작하는 강의에요!"}
          </p>
        </div>
        <div className="lg:col-span-3 col-span-1"></div>
      </div>
      <div></div>
    </>
  );
};

export default LectureDetail;
