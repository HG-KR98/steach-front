import React, { useRef, useState } from "react";
import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { TbArrowsRight } from "react-icons/tb";
import checkimg from "../../assets/checked.jpg";
import uncheckimg from "../../assets/unchecked.jpg";
import banner from "../../assets/banner2.jpg";
import { SignUpLecture } from "../../api/lecture/curriculumAPI.ts";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store.tsx";
import { CurriculaFormData } from "../../interface/Curriculainterface.tsx";

import type { Editor } from "@toast-ui/react-editor";
import ToastEditor from "../main/ToastEditor.tsx";

const LectureSignUp: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const editorRef = useRef<Editor>(null);

  type Weekday = "월" | "화" | "수" | "목" | "금" | "토" | "일";
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

  // const encodeHtml = (str: string) => {
  //   return str.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
  //     return '&#'+i.charCodeAt(0)+';';
  //   });
  // };

  const getContents = () => {
    const markdownContent = editorRef.current
      ?.getInstance()
      .getMarkdown()
      .replace(/(?:\r\n|\r|\n)/g, "\\\\n");
    const htmlContent = editorRef.current?.getInstance().getHTML();
    setFormData((prevFormData) => ({
      ...prevFormData,
      information: encodeHtml(htmlContent),
    }));

    console.log(
      "[Toast Editor - Markdown]\n",
      markdownContent,
      "\n\n[Toast Editor - HTML]\n",
      htmlContent
    );
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

  // const handleEditorChange = (data: string) => {
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     information: data,
  //   }));
  // };

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
    // Create a new DOMParser instance
    const parser = new DOMParser();
    // Parse the HTML string into a document object
    const doc = parser.parseFromString(htmlContent, "text/html");
    // Serialize the document back to a string to ensure it's valid HTML
    return new XMLSerializer().serializeToString(doc.body);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    getContents();
    const formDataToSend = {
      ...formData,
      // intro: encodeHtmlTags(formData.intro),
      // information: encodeHtmlTags(formData.information),
      intro: formData.intro,
      information: formData.information,
      weekdays_bitmask: formatBitmask(formData.weekdays_bitmask),
    };
    console.log(formDataToSend);
    dispatch(SignUpLecture(formDataToSend));
  };

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-2"></div>
      <div className=" col-span-8 p-4">
        <img src={banner} className="mx-auto w-2/3 rounded-2xl" />
        <p className="self-start text-5xl pt-20 pl-5 pb-3">강의 등록</p>
        <hr></hr>
        <form onSubmit={handleSubmit}>
          <FormControl>
            <div className="flex items-center mb-5">
              <FormLabel htmlFor="title" className="mt-3 ml-3 mr-8 text-2xl ">
                강의 제목
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
              <FormLabel htmlFor="sub_title" className="mt-3 mx-3 text-2xl ">
                강의 부제목
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
              <FormLabel htmlFor="category" className="mt-3 mx-3 text-2xl">
                강의 대분류
              </FormLabel>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="border-2 rounded-lg w-1/3 p-2 mt-3"
              >
                <option value="1">KOREAN</option>
                <option value="2">MATH</option>
                <option value="3">FOREIGN_LANGUAGE</option>
                <option value="4">SCIENCE</option>
                <option value="5">ENGINEERING</option>
                <option value="6">ARTS_AND_PHYSICAL</option>
                <option value="7">EDUCATION</option>
                <option value="8">ETC</option>
              </select>
              <FormLabel htmlFor="sub_category" className="mt-3 mx-3 text-2xl">
                강의 중분류
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
              강의 배너 이미지
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
              강의 소개
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
              강의 커리큘럼
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
              강의 상세 설명
            </FormLabel>
            {/*  에디터 */}
            <ToastEditor content={formData.information} editorRef={editorRef} />
            <div className="p-5 border my-5">
              <h1 className="text-6xl">강의 등록시 주의사항</h1>
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
      </div>
      <div className="col-span-2"></div>
    </div>
  );
};
export default LectureSignUp;
