import React, { useEffect, useState } from "react";
import all from "../../../assets/futureHokyung.jpg";
import korean from "../../../assets/subject/korean.png";
import math from "../../../assets/subject/math.png";
import social from "../../../assets/subject/social.png";
import science from "../../../assets/subject/science.png";
import artsandphysical from "../../../assets/subject/artsandphysical.png";
import foreignlanguage from "../../../assets/subject/foreignlanguage.png";
import engineering from "../../../assets/subject/engineering.png";
import etc from "../../../assets/subject/etc.png";

interface SearchCategoryMenuProps {
  handleCategoryChange: (category: string) => void;
  initialCategory: string;
}

interface Subject {
  name: string;
  icon: string;
  value: string;
}

const SearchCategoryMenu: React.FC<SearchCategoryMenuProps> = ({
  handleCategoryChange,
  initialCategory,
}) => {
  // 배열의 타입을 Subject 배열로 정의
  const subjects: Subject[] = [
    { name: "#전체", icon: all, value: "" },
    { name: "#국어", icon: korean, value: "KOREAN" },
    { name: "#수학", icon: math, value: "MATH" },
    { name: "#사회", icon: social, value: "SOCIAL" },
    { name: "#과학", icon: science, value: "SCIENCE" },
    { name: "#예체능", icon: artsandphysical, value: "ARTS_AND_PHYSICAL" },
    { name: "#공학", icon: engineering, value: "ENGINEERING" },
    { name: "#외국어", icon: foreignlanguage, value: "FOREIGN_LANGUAGE" },
    { name: "#기타", icon: etc, value: "ETC" },
  ];

  // 현재 선택된 subject value를 저장할 상태
  const [selectedValue, setSelectedValue] = useState<string>(
    initialCategory || ""
  );

  // 아이콘 클릭시 값을 변화시키는 핸들러 함수
  const handleChange = (value: string) => {
    setSelectedValue(value);
    handleCategoryChange(value);
  };

  useEffect(() => {
    if (initialCategory) {
      handleChange(initialCategory);
    }
  }, [initialCategory]);

  return (
    <section className="flex justify-center">
      <div className="flex text-center">
        {subjects.map((subject, index) => (
          <button
            key={index}
            type="button"
            className={`mx-6 my-12 p-2 rounded-md ${
              selectedValue === subject.value ? "bg-orange-200" : ""
            }`}
            onClick={() => handleChange(subject.value)}
          >
            <img
              src={subject.icon}
              alt={subject.name}
              className="sm:size-8 md:size-12 lg:size-16 text-indigo-950"
            />
            <div className="text-lightNavy">{subject.name}</div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default SearchCategoryMenu;
