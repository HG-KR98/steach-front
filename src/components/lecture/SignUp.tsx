import React, { useRef, useState } from "react";
import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { TbArrowsRight } from "react-icons/tb";
import checkimg from "../../assets/checked.jpg";
import uncheckimg from "../../assets/unchecked.jpg";
import banner from "../../assets/banner2.jpg";
import { SignUpLecture } from "../../api/lecture/curriculumAPI.ts";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store.tsx";
import { Curricula, CurriculaFormData } from "../../interface/Curriculainterface.tsx";

import type { Editor } from "@toast-ui/react-editor";
import ToastEditor from "../main/ToastEditor.tsx";
import { useNavigate } from "react-router-dom";
import { CurriculasState } from "../../store/CurriculaSlice.tsx";
import { toast } from "react-toastify";

const LectureSignUp: React.FC = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const editorRef = useRef<Editor>(null);

  type Weekday = "월" | "화" | "수" | "목" | "금" | "토" | "일";

  const curriculaData = useSelector(
    (state: RootState) => (state.curriculum as CurriculasState).curricula
  );

  const [activeDays, setActiveDays] = useState<{ [key in Weekday]: boolean }>({
    월: false,
    화: false,
    수: false,
    목: false,
    금: false,
    토: false,
    일: false,
  });

  // 데이터를 담기 위한 박스 개념, 함수를 위의 interface에 맞춰서 작성
  const [formData, setFormData] = useState<CurriculaFormData>({
    title: "",
    sub_title: "",
    category: "KOREAN",
    sub_category: "",
    banner_img_url: "",
    intro: "",
    start_date: new Date().toISOString().substr(0, 10),
    end_date: new Date().toISOString().substr(0, 10),
    lecture_start_time: new Date().toTimeString().substr(0, 5),
    lecture_end_time: new Date().toTimeString().substr(0, 5),
    weekdays_bitmask: 0,
    max_attendees: 4,
    information:
      "<예시> 강의 대상: 초등생 4~5학년 수준의 강의입니다. <br>학습 요구사항: 자바 객체지향 선행학습 필수  <br>강의 설명 : 자바스크립트 언어의 기초부터 심화까지 완전 정복",
  });

  const WEEKDAY_VALUES: Record<Weekday, number> = {
    월: 64,
    화: 32,
    수: 16,
    목: 8,
    금: 4,
    토: 2,
    일: 1,
  };

  const getContents = () => {
    // const markdownContent = editorRef.current
    //   ?.getInstance()
    //   .getMarkdown()
    //   .replace(/(?:\r\n|\r|\n)/g, "\\\\n");
    const htmlContent = editorRef.current?.getInstance().getHTML();
    setFormData((prevFormData) => ({
      ...prevFormData,
      information: encodeHtml(htmlContent),
    }));


  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, files } = event.target as HTMLInputElement;
    if (type === "file") {
      const file = files ? files[0] : null;
      setFormData({
        ...formData,
        [name]: file,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleCheckboxChange = (day: Weekday) => {
    setActiveDays((prevActiveDays) => {
      const newActiveDays = {
        ...prevActiveDays,
        [day]: !prevActiveDays[day],
      };
      const newBitmask = Object.keys(newActiveDays).reduce((bitmask, key) => {
        const weekday = key as Weekday;
        if (newActiveDays[weekday]) {
          return bitmask + WEEKDAY_VALUES[weekday];
        }
        return bitmask;
      }, 0);
      setFormData((prevFormData) => ({
        ...prevFormData,
        weekdays_bitmask: newBitmask,
      }));
      return newActiveDays;
    });
  };

  const formatBitmask = (bitmask: number): string => {
    return bitmask.toString(2).padStart(7, "0");
  };

  const encodeHtml = (htmlContent: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    return new XMLSerializer().serializeToString(doc.body);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await getContents();
  
    const formDataToSend = {
      ...formData,
      intro: formData.intro,
      information: formData.information,
      weekdays_bitmask: formatBitmask(formData.weekdays_bitmask),
    };
  
    try {
      const Postcurricula = await dispatch(SignUpLecture(formDataToSend));
      let curriculaData = Postcurricula.payload as Curricula;
  
      const waitForCurriculumId = () => {
        return new Promise<string | undefined>((resolve, reject) => {
          const interval = setInterval(() => {
            if (curriculaData?.curriculum_id !== undefined) {
              clearInterval(interval);
              resolve(curriculaData.curriculum_id);
            }
          }, 100); // 100ms 간격으로 체크
  
          setTimeout(() => {
            clearInterval(interval);
            reject(new Error("Timeout waiting for curriculum_id"));
          }, 10000); // 최대 10초 동안 기다림
        });
      };
  
      const curriculumId = curriculaData?.curriculum_id !== undefined
        ? curriculaData.curriculum_id
        : await waitForCurriculumId();
  
      if (curriculumId !== undefined) {
        navigate(`/curricula/detail/${curriculumId}`);
        toast.success("등록 되었습니다!", {
          position: "top-right",
        });
      } 
    } catch (error) {
      toast.error("에러 발생!", {
        position: "top-right",
      });
    }
  };

  // 뒤로가기
  const handleBackPage = () => {
    navigate(-1);
  };

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-2"></div>
      <section className=" col-span-8 p-4">
        <img src={banner} className="mx-auto w-2/3 rounded-2xl" />
        <div className="relative">
          <p className="self-start text-5xl font-semibold pt-20 pl-5 pb-3">
            커리큘럼 등록
          </p>
          <button
            className="absolute top-16 right-8 p-3 bg-red-400 text-white font-semibold rounded-md hover:bg-red-500"
            onClick={handleBackPage}
          >
            뒤로가기
          </button>
        </div>
        <hr></hr>
        <form onSubmit={handleSubmit}>
          <FormControl>
            <div className="flex items-center mb-5">
              <FormLabel htmlFor="title" className="mt-3 ml-3 mr-8 text-lg ">
                커리큘럼 제목
              </FormLabel>
              <Input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="border-2 rounded-lg w-1/3 p-2 mt-3"
                required
              />
              <FormLabel htmlFor="sub_title" className="mt-3 mx-3 text-lg ">
                커리큘럼 부제목
              </FormLabel>
              <Input
                type="text"
                id="sub_title"
                name="sub_title"
                value={formData.sub_title}
                onChange={handleChange}
                className="border-2 rounded-lg w-1/3 p-2 mt-3"
                required
              />
            </div>
            <hr></hr>
            <div className="flex items-center mb-5">
              <FormLabel htmlFor="category" className="mt-3 mx-3 text-lg">
                커리큘럼 대분류
              </FormLabel>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="border-2 rounded-lg w-1/3 p-2 mt-3"
              >
                <option value="KOREAN">KOREAN</option>
                <option value="MATH">MATH</option>
                <option value="FOREIGN_LANGUAGE">FOREIGN_LANGUAGE</option>
                <option value="SCIENCE">SCIENCE</option>
                <option value="SOCIAL">SOCIAL</option>
                <option value="ENGINEERING">ENGINEERING</option>
                <option value="ARTS_AND_PHYSICAL">ARTS_AND_PHYSICAL</option>
                <option value="EDUCATION">EDUCATION</option>
                <option value="ETC">ETC</option>
              </select>
              <FormLabel htmlFor="sub_category" className="mt-3 mx-3 text-lg">
                커리큘럼 중분류
              </FormLabel>
              <Input
                type="text"
                id="sub_category"
                name="sub_category"
                value={formData.sub_category}
                onChange={handleChange}
                className="border-2 rounded-lg w-1/3 p-2 mt-3"
                required
              />
            </div>
            <hr></hr>
            <FormLabel htmlFor="banner_img_url" className="mt-3 mx-3 text-2xl">
              커리큘럼 배너 이미지
            </FormLabel>
            <Input
              type="file"
              id="banner_img_url"
              name="banner_img_url"
              // value={formData.banner_img_url}
              onChange={handleChange}
              className="border-2 rounded-lg w-4/5 p-2 mb-3"
              required
            />
            <hr></hr>
            <FormLabel htmlFor="intro" className="my-3 mx-3 text-2xl">
              커리큘럼 소개
            </FormLabel>
            <Input
              type="text"
              id="intro"
              name="intro"
              value={formData.intro}
              onChange={handleChange}
              className="border-2 rounded-lg w-full p-2 mt-3"
              required
            />
            <hr className="my-3"></hr>
            <FormLabel htmlFor="datetime" className="mt-3 mx-3 text-2xl">
              강의
            </FormLabel>
            <div className="flex items-center mb-5">
              <div className="w-1/2">
                <FormLabel htmlFor="date" className="mt-3 mx-3 text-1xl">
                  강의 시작일 - 강의 종료일
                </FormLabel>
              </div>
              <div className="w-1/2">
                <FormLabel
                  htmlFor="lecture_time"
                  className="mt-3 mx-3 text-1xl"
                >
                  시작 시간 - 종료 시간
                </FormLabel>
              </div>
            </div>
            <div className="flex items-center mb-5">
              <div className="w-1/2">
                <Input
                  type="date"
                  id="start_date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className="border-2 rounded-lg w-40 p-2 mb-5"
                  required
                />
                <span className="inline-block align-middle p-3">
                  <TbArrowsRight />
                </span>
                <Input
                  type="date"
                  id="end_date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className="border-2 rounded-lg w-40 p-2 mb-5"
                  required
                />
              </div>
              <div className="w-1/2">
                <Input
                  type="time"
                  id="lecture_start_time"
                  name="lecture_start_time"
                  value={formData.lecture_start_time}
                  onChange={handleChange}
                  className="border-2 rounded-lg w-40 p-2 mb-5"
                  required
                />
                <span className="inline-block align-middle p-3">
                  <TbArrowsRight />
                </span>
                <Input
                  type="time"
                  id="lecture_end_time"
                  name="lecture_end_time"
                  value={formData.lecture_end_time}
                  onChange={handleChange}
                  className="border-2 rounded-lg w-40 p-2 mb-5"
                  required
                />
              </div>
            </div>
            <hr className="my-3"></hr>
            <FormLabel htmlFor="datetime" className="mt-3 mx-3 text-2xl">
              수업 요일
            </FormLabel>
            <div className="flex justify-center">
              {Object.keys(activeDays).map((day, i) => (
                <label
                  key={i}
                  style={{
                    position: "relative",
                    display: "inline-block",
                    marginRight: "8px",
                  }}
                >
                  <img
                    src={activeDays[day as Weekday] ? checkimg : uncheckimg}
                    onClick={() => handleCheckboxChange(day as Weekday)}
                    style={{ cursor: "pointer", width: "80px", height: "80px" }}
                    alt={day}
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: "55%",
                      left: "45%",
                      transform: "translate(-50%, -50%)",
                      color: "black", // 필요에 따라 텍스트 색상 변경
                      fontWeight: "bold", // 필요에 따라 텍스트 스타일 변경
                      fontSize: "20px", // 필요에 따라 텍스트 크기 변경
                      pointerEvents: "none", // 텍스트가 클릭 이벤트를 방해하지 않도록 설정
                    }}
                  >
                    {day}
                  </span>
                </label>
              ))}
            </div>

            <FormLabel htmlFor="datetime" className="text-2xl">
              최대 수강 정원
            </FormLabel>
            <select
              id="max_attendees"
              name="max_attendees"
              value={formData.max_attendees}
              onChange={handleChange}
              className="border-2 rounded-lg p-2 mb-5"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>

            <FormLabel htmlFor="datetime" className="text-2xl">
              커리큘럼 상세 설명
            </FormLabel>
            {/*  에디터 */}
            <ToastEditor content={formData.information} editorRef={editorRef} />
            <div className="p-5 border my-5">
              <h1 className="text-6xl">커리큘럼 등록시 주의사항</h1>
              <ul>
                <li>
                  - 이해하기 쉬운 언어 사용: 학생들의 연령대에 맞는 쉬운 언어와
                  예시를 사용해 강의를 준비하세요.
                </li>
                <li>
                  - 적절한 강의 시간 설정: 집중력이 떨어지지 않도록 강의 시간을
                  적절하게 조절하고, 쉬는 시간을 포함하세요.
                </li>
                <li>
                  - 참여 유도: 학생들이 적극적으로 참여할 수 있도록 질문을
                  유도하고, 활동적인 학습 방법을 도입하세요.
                </li>
                <li>
                  - 안전과 윤리 준수: 강의 내용과 활동은 안전하고 윤리적이어야
                  하며, 학생들의 개인정보 보호에 유의하세요.
                </li>
              </ul>
            </div>
            <button
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
              onClick={getContents}
              type="submit"
            >
              등록하기
            </button>
          </FormControl>
        </form>
      </section>
      <div className="col-span-2"></div>
    </div>
  );
};
export default LectureSignUp;