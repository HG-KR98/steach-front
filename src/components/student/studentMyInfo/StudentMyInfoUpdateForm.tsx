import { AppDispatch, RootState } from "../../../store";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { updateStudentInfo } from "../../../store/userInfo/StudentProfileSlice";
import { fetchStudentInfo } from "../../../store/userInfo/StudentProfileSlice";
import { toast } from "react-toastify";
import DeleteModal from "../../main/modal/DeleteModal";

export interface StudentInfoUpdateForm {
  nickname: string;
  email: string;
  password: string;
  password_auth_token: string | null;
}

const StudentMyInfoUpdateForm: React.FC = () => {
  const temporaryToken = localStorage.getItem("passwordAuthToken");
  const dispatch = useDispatch<AppDispatch>();

  const teacherData = useSelector(
    (state: RootState) => state.studentProfile.info
  );
  useEffect(() => {
    dispatch(fetchStudentInfo());
  }, [dispatch]);

  // 폼 값 바인딩
  const [formData, setFormData] = useState<StudentInfoUpdateForm>({
    nickname: teacherData?.nickname || "",
    password: "",
    email: teacherData?.email || "",
    password_auth_token: temporaryToken,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // 내 정보 수정 요청
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(updateStudentInfo(formData));
    localStorage.removeItem("passwordAuthToken");
    window.location.reload();
    toast.success("수정되었습니다!", {
      position: "top-right",
    });
  };

  // 새로고침을 뒤로가기
  const handleBackPage = () => {
    window.location.reload();
  };

  return (
    <div className="w-9/12 border-2 border-hardBeige rounded-xl shadow-lg p-6 my-12 mx-auto relative">
      <form onSubmit={(e) => handleUpdateSubmit(e)}>
        <header className="relative">
          <h1 className="my-2 p-2 text-center text-5xl font-bold text-lightNavy">
            내정보 수정
          </h1>
          <button
            type="button"
            onClick={handleBackPage}
            className="p-3 absolute top-5 right-8 text-white font-semibold bg-red-300 rounded-md hover:bg-red-400"
          >
            뒤로가기
          </button>
        </header>
        <section className="grid grid-cols-1 my-4 p-2 border-b-2">
          <label className="my-2 text-3xl font-semibold text-lightNavy">
            닉네임
          </label>
          <input
            name="nickname"
            className="my-3 p-2 w-72 border-2 rounded-md"
            value={formData.nickname}
            onChange={(e) => handleChange(e)}
            required
          />
        </section>
        <section className="grid grid-cols-1 my-4 p-2 border-b-2">
          <label className="my-2 text-3xl font-semibold text-lightNavy">
            비밀번호
          </label>
          <input
            name="password"
            type="password"
            className="my-3 p-2 w-72 border-2 rounded-md"
            value={formData.password}
            onChange={(e) => handleChange(e)}
            required
          />
        </section>
        <section className="grid grid-cols-1 mt-4 mb-20 p-2 border-b-2">
          <label className="my-2 text-3xl font-semibold text-lightNavy">
            이메일
          </label>
          <input
            name="email"
            type="email"
            className="my-3 p-2 w-72 border-2 rounded-md"
            value={formData.email}
            onChange={(e) => handleChange(e)}
            required
          />
        </section>
        <section className="absolute bottom-0 right-0 p-6 flex justify-end">
          <button
            onClick={(e) => handleUpdateSubmit(e)}
            className="p-3 bg-blue-300 text-white font-semibold rounded-md shadow-md hover:bg-blue-400 mr-4"
          >
            수정하기
          </button>
          {/* 모달을 이용하여 삭제 */}
          <DeleteModal purpose="student" />
        </section>
      </form>
    </div>
  );
};

export default StudentMyInfoUpdateForm;
