import { useState } from "react";
import logoImage from "../../../assets/LOGO.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { SearchSendCurricula } from "../../../interface/search/SearchInterface";
import { useLocation } from "react-router-dom";

const NavbarLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 현재 경로 추출
  const currentPath = location.pathname;

  // 현재 경로가 '/search'일 때 url params에서 값을 추출하기
  const params = new URLSearchParams(location.search);
  const curriculum_category = params.get("curriculum_category") || null;
  const order = params.get("order") || null;
  const only_available = params.get("only_available") || null;

  // 햄버거 메뉴 상태
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 검색창 바인딩 상태
  const [inputSearch, setInputSearch] = useState("");

  // 검색 요청을 보낼 상태
  const [searchData, setSearchData] = useState<SearchSendCurricula>({
    curriculum_category: "",
    order: "",
    only_available: false,
    search: "",
    pageSize: 12,
    currentPageNumber: 1,
  });

  // 검색창 바인딩
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputSearch(e.target.value);
    // 상태 업데이트
    const { name, value } = e.target;
    setSearchData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // 메뉴 토글하기
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // 로그인을 안했을때 로그인 하라고 하면서 로그인 창으로 이동시키기
  const handleIsLogin = () => {
    toast.warn("로그인을 해야 이용 가능합니다.", {
      position: "top-right",
    });
    navigate("/user/login");
  };

  // 검색 함수
  const handleSearchBar = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPath === "/search") {
      const searchParams = new URLSearchParams();
      searchParams.set("curriculum_category", curriculum_category || "");
      searchParams.set("search", inputSearch);
      searchParams.set("order", order || "LATEST");
      searchParams.set("only_available", only_available?.toString() || "false");
      searchParams.set("pageSize", searchData.pageSize.toString());
      searchParams.set(
        "currentPageNumber",
        searchData.currentPageNumber.toString()
      );
      setInputSearch("");
      // 검색어와 옵션들을 URL 파라미터로 포함시켜 이동
      navigate(`/search?${searchParams.toString()}`);
    } else {
      const searchParams = new URLSearchParams();
      searchParams.set("search", inputSearch);
      searchParams.set("order", searchData.order);
      searchParams.set("only_available", searchData.only_available.toString());
      searchParams.set("pageSize", searchData.pageSize.toString());
      searchParams.set(
        "currentPageNumber",
        searchData.currentPageNumber.toString()
      );
      setInputSearch("");
      // 검색어와 옵션들을 URL 파라미터로 포함시켜 이동
      navigate(`/search?${searchParams.toString()}`);
    }
  };

  return (
    <nav className="sticky top-0 flex flex-wrap items-center justify-between p-2 bg-Beige border-b-2 border-hardBeige z-10">
      {/* Navbar 로고 */}
      <Link to={"/home"}>
        <div className="w-28 ml-4">
          <img src={logoImage} alt="logo" className="w-full h-20" />
        </div>
      </Link>
      {/* 검색창 */}
      <div className="flex-1 flex items-center justify-between lg:justify-around">
        <form
          className="relative mx-2 lg:mx-4 flex-grow lg:flex-grow-0 lg:w-1/2"
          onSubmit={handleSearchBar}
        >
          <input
            type="text"
            name="search"
            placeholder="나의 성장을 도와줄 커리큘럼을 검색해보세요."
            value={inputSearch}
            onChange={(e) => handleChange(e)}
            className="p-2 border-2 w-full h-10 rounded-md border-hardBeige"
          />
          <button
            type="button"
            className="absolute right-3 inset-y-2 hover:text-orange-300"
            onClick={handleSearchBar}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} className="size-6" />
          </button>
        </form>

        {/* 메뉴 */}
        <ul className="hidden lg:flex lg:flex-row lg:justify-between text-lg font-bold ml-4 lg:ml-0">
          <li className="mx-4 lg: m-2 lg:px-2 lg:py-0">
            <Link to={"/search"} className="hover:text-orange-300">
              강의
            </Link>
          </li>
          <li className="mx-4 lg: m-2 lg:px-2 lg:py-0">
            <button onClick={handleIsLogin} className="hover:text-orange-300">
              내 강의실
            </button>
          </li>
          <li className="p-2">
            <a
              onClick={() => {
                navigate("/classroom");
              }}
              className="hover:text-orange-300"
            >
              문의하기
            </a>
          </li>
        </ul>
      </div>
      {/* 로그인 및 회원가입 버튼 */}
      <div className="hidden mr-3 lg:flex items-center ml-4 lg:ml-0">
        <button
          className="ml-2 p-2 w-auto border-2 font-semibold border-hardBeige rounded-md bg-white"
          onClick={() => {
            navigate("/user/login");
          }}
        >
          로그인
        </button>

        <button
          className="ml-2 p-2 w-auto text-white font-semibold bg-red-400 border-2 border-hardBeige rounded-md hover:bg-red-500"
          onClick={() => {
            navigate("/user/signup");
          }}
        >
          회원가입
        </button>
      </div>
      {/* 햄버거 메뉴 아이콘 */}
      <div className="lg:hidden">
        <button onClick={toggleMenu} className="focus:outline-none">
          <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} size="2x" />
        </button>
      </div>
      {/*  ------------------------------------------------------------------------------------------------------- */}
      {/* 모바일 메뉴 */}
      {isMenuOpen && (
        <div className="w-full flex flex-col lg:hidden">
          <ul className="flex flex-col w-full text-lg font-bold mt-4">
            <li className="p-2">
              <Link to={"/search"} className="hover:text-orange-300">
                강의
              </Link>
            </li>
            <li className="p-2">
              <button onClick={handleIsLogin} className="hover:text-orange-300">
                내 강의실
              </button>
            </li>
            <li className="p-2">
              <a
                onClick={() => {
                  navigate("/classroom");
                }}
                className="hover:text-orange-300"
              >
                문의하기2
              </a>
            </li>
          </ul>
          <div className="flex flex-col items-center mt-4 mx-2">
            <button
              className="w-full mb-2 p-2 font-semibold border-2 border-hardBeige rounded-md"
              onClick={() => {
                navigate("/user/login");
              }}
            >
              로그인
            </button>
            <button
              className="text-white font-semibold bg-red-400 border-2 p-2 rounded-md hover:bg-red-500 w-full"
              onClick={() => {
                navigate("/user/signup");
              }}
            >
              회원가입
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavbarLogin;
