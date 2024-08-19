import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import NavbarLogin from "./NavbarLogin";
import NavbarStudent from "./NavbarStudent";
import NavbarTeacher from "./NavbarTeacher";

// 김헌규 - Navbar 반응형 구현
const Navbar: React.FC = () => {
  const userDataString = localStorage.getItem("auth");
  const userData = userDataString ? JSON.parse(userDataString) : null;
  useSelector((state: RootState) => state.auth);

  return (
    <>
      {!userData && <NavbarLogin />}
      {userData && userData.role === "STUDENT" && (
        <NavbarStudent nickname={userData.nickname} />
      )}
      {userData && userData.role === "TEACHER" && (
        <NavbarTeacher nickname={userData.nickname} />
      )}
    </>
  );
};

export default Navbar;
