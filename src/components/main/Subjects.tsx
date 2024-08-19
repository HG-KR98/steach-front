import React from "react";
import korean from "../../assets/subject/korean.png";
import math from "../../assets/subject/math.png";
import social from "../../assets/subject/social.png";
import science from "../../assets/subject/science.png";
import artsandphysical from "../../assets/subject/artsandphysical.png";
import engineering from "../../assets/subject/engineering.png";
import foreignlanguage from "../../assets/subject/foreignlanguage.png";
import etc from "../../assets/subject/etc.png";
import all from "../../assets/subject/booklist.png";

// 김헌규 - 자바스크립트 코드를 타입스크립트 코드로 변경(컴포넌트 함수 및 interface와 Subject 타입으로 작성)
// 김헌규 - 화면 크기에 따른 아이콘 크기 설정(점점 작아지도록)
const Subjects: React.FC = () => {
  // 김헌규
  interface Subject {
    name: string;
    icon: string;
    http: string;
  }

  // 배열의 타입을 Subject 배열로 정의
  // 김헌규
  const subjects: Subject[] = [
    { name: "#전체", icon: all, http: "" },
    { name: "#국어", icon: korean, http: "KOREAN" },
    { name: "#수학", icon: math, http: "MATH" },
    { name: "#사회", icon: social, http: "SOCIAL" },
    { name: "#과학", icon: science, http: "SCIENCE" },
    { name: "#예체능", icon: artsandphysical, http: "ARTS_AND_PHYSICAL" },
    { name: "#공학", icon: engineering, http: "ENGINEERING" },
    { name: "#외국어", icon: foreignlanguage, http: "FOREIGN_LANGUAGE" },
    { name: "#ETC", icon: etc, http: "ETC" },
  ];

  return (
    <section className="flex justify-center">
      <div>
        <div className="flex text-center">
          {subjects.map((subject, index) => (
            <a
              href={`/search?curriculum_category=${subject.http}`}
              key={index}
              className="mx-6 my-12 transform transition-transform duration-300 hover:scale-150"
            >
              <img
                src={`${subject.icon}`}
                className="sm:size-8 md:size-12 lg:size-16 text-indigo-950"
              />
              <div className="text-lg font-semibold text-lightNavy">
                {subject.name}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Subjects;
