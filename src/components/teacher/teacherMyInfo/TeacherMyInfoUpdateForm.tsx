import { AppDispatch, RootState } from "../../../store";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {
  fetchTeacherInfo,
  updateTeacherInfo,
} from "../../../store/userInfo/TeacherProfileSlice";
import DeleteModal from "../../main/modal/DeleteModal";
import { toast } from "react-toastify";

export interface TeacherInfoUpdateForm {
  nickname: string;
  email: string;
  password: string;
  brief_introduction: string;
  academic_background: string;
  specialization: string;
  password_auth_token: string | null;
}

const TeacherMyInfoUpdateForm: React.FC = () => {
  const temporaryToken = localStorage.getItem("passwordAuthToken");
  const dispatch = useDispatch<AppDispatch>();
  const teacherData = useSelector(
    (state: RootState) => state.teacherProfile.info
  );

  useEffect(() => {
    dispatch(fetchTeacherInfo());
  }, [dispatch]);

  // 폼 값 바인딩
  const [formData, setFormData] = useState<TeacherInfoUpdateForm>({
    nickname: teacherData?.nickname || "",
    password: "",
    email: teacherData?.email || "",
    brief_introduction: teacherData?.brief_introduction || "",
    academic_background: teacherData?.academic_background || "",
    specialization: teacherData?.specialization || "",
    password_auth_token: temporaryToken,
  });

  // 값 입력
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
    await dispatch(updateTeacherInfo(formData));
    localStorage.removeItem("passwordAuthToken");
    window.location.reload();
    toast.success("수정되었습니다!", {
      position: "top-right",
    });
  };

  // 새로 고침으로 뒤로가게 하기
  const handleBackPage = () => {
    window.location.reload();
  };

  return (
    <div className="mx-auto my-12 p-6 w-9/12 border-2 border-hardBeige rounded-xl shadow-lg relative">
      <form onSubmit={(e) => handleUpdateSubmit(e)}>
        <header className="flex justify-center relative">
          <h1 className="my-2 p-2 text-center text-5xl font-bold text-lightNavy">
            내정보 수정
          </h1>
          <button
            type="button"
            onClick={handleBackPage}
            className="p-3 text-white font-semibold bg-red-300 rounded-md absolute top-5 right-5 hover:bg-red-400"
          >
            뒤로가기
          </button>
        </header>
        <section className=" grid grid-cols-1 my-4 p-2 border-b-2">
          <label className="my-2 text-3xl font-semibold text-lightNavy">
            닉네임
          </label>
          <input
            name="nickname"
            className="p-2 w-72 border-2 rounded-md"
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
            className="p-2 w-72 border-2 rounded-md"
            value={formData.password}
            onChange={(e) => handleChange(e)}
            required
          />
        </section>
        <section className="grid grid-cols-1 my-4 p-2 border-b-2">
          <label className="my-2 text-3xl font-semibold text-lightNavy">
            이메일
          </label>
          <input
            name="email"
            type="email"
            className="my-2 p-2 w-72 border-2 rounded-md"
            value={formData.email}
            onChange={(e) => handleChange(e)}
            required
          />
        </section>
        <section className="grid grid-cols-1 my-4 p-2 border-b-2">
          <label className="my-2 text-3xl font-semibold text-lightNavy">
            간단한 소개 문구
          </label>
          <textarea
            name="brief_introduction"
            className="my-2 p-2 w-72 border-2 rounded-md"
            value={formData.brief_introduction}
            onChange={(e) => handleChange(e)}
          />
        </section>
        <section className="grid grid-cols-1 my-4 p-2 border-b-2">
          <label className="my-2 text-3xl font-semibold text-lightNavy">
            학력
          </label>

          <input
            name="academic_background"
            className="my-2 p-2 w-72 border-2 rounded-md"
            value={formData.academic_background}
            onChange={(e) => handleChange(e)}
            required
          />
        </section>
        <section className="grid grid-cols-1 my-4 p-2 border-b-2">
          <label className="my-2 text-3xl font-semibold text-lightNavy ">
            전공분야
          </label>
          <input
            name="specialization"
            className="my-2 p-2 w-72 border-2 rounded-md"
            value={formData.specialization}
            onChange={(e) => handleChange(e)}
            required
          />
        </section>
        <section className="flex justify-end">
          <button
            type="submit"
            className="mx-2 p-3 bg-blue-300 text-white font-semibold rounded-md shadow-md hover:bg-blue-400"
          >
            수정하기
          </button>
          {/* 모달을 이용하여 삭제 */}
          <DeleteModal purpose="teacher" />
        </section>
      </form>
    </div>
  );
};

export default TeacherMyInfoUpdateForm;
