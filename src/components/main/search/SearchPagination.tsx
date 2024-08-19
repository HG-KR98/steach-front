import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { SearchSendCurricula } from "../../../interface/search/SearchInterface";
import { useNavigate, useLocation } from "react-router-dom";

interface SearchPaginationProps {
  searchOption: SearchSendCurricula;
}

const SearchPagination: React.FC<SearchPaginationProps> = ({
  searchOption,
}) => {
  const navigate = useNavigate();

  const location = useLocation();
  const params = new URLSearchParams(location.search);

  // params에서 값 추출
  const curriculum_category = params.get("curriculum_category");
  const order = params.get("order");
  const only_available = params.get("only_available");
  const search = params.get("search");

  // 중앙 저장소에서 총 페이지 수 가져오기
  const total_page = useSelector((state: RootState) => state.search.total_page);

  // 전체 페이지 수를 활용하여 숫자 배열을 만들기
  const pages = Array.from({ length: total_page }, (_, i) => i + 1);

  // 기존 params에서 현재 페이지 정보만 수정해서 navigate로 이동하기
  const handlePageChange = (page: number) => {
    const searchParams = new URLSearchParams();
    searchParams.set("curriculum_category", curriculum_category || "");
    searchParams.set("search", search || "");
    searchParams.set("order", order || "LATEST");
    searchParams.set("only_available", only_available?.toString() || "false");
    searchParams.set("pageSize", "12");
    searchParams.set("currentPageNumber", `${page}`);

    navigate(`/search?${searchParams.toString()}`);
  };

  return (
    <div className="flex justify-center my-4">
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`mx-1 px-3 py-1 border ${
            searchOption.currentPageNumber === page
              ? "bg-red-200 text-white"
              : "bg-white"
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default SearchPagination;
