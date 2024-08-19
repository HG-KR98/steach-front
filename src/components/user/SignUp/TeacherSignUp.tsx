import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  signUpTeacher,
  loginSteach,
} from "../../../store/userInfo/AuthSlice.tsx";
import { RootState, AppDispatch } from "../../../store.tsx";
import {
  TeacherSignUpForm,
  LoginForm,
  TeacherCheckForm,
} from "../../../interface/auth/AuthInterface.tsx";
import {
  checkUsernameDuplicateApi,
  checkTeacherEmailDuplicateApi,
} from "../../../api/user/userAPI.ts";
import { toast } from "react-toastify";
import teacher from "../../../assets/teacher.png";
import SpinnerComponent from "../../main/spinner/Spinner";

// 선생님 회원가입
const TeacherSignUp: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { status } = useSelector((state: RootState) => state.auth);

  // 확인이 필요한데, file에 대해서 null값으로 지정
  const [formData, setFormData] = useState<TeacherSignUpForm>({
    username: "",
    password: "",
    nickname: "",
    email: "",
    file: undefined,
  });

  // 비밀번호 확인 검증
  const [confirmPassword, setComfirmPassword] = useState("");

  // 각종 검증 데이터 상태
  const [checkInfo, setCheckInfo] = useState<TeacherCheckForm>({
    usernameDuplicate: null,
    emailDuplicate: null,
    passwordCoincidence: false,
  });

  /// 비밀번호 확인 양방향 바인딩
  const handleComfirmPassword = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setComfirmPassword(value);

    setCheckInfo((prevState) => ({
      ...prevState,
      passwordCoincidence: formData.password === value,
    }));
  };

  // 비밀번호 일치 상태를 실시간으로 추적
  useEffect(() => {
    console.log(checkInfo.passwordCoincidence);
  }, [checkInfo.passwordCoincidence]);

  // 학생 회원가입 페이지와 같지만, file 추가로 조금 다름
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === "file" && files) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        file: files[0],
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  // 아이디 중복 체크 호출 핸들러 함수
  const handleCheckUsernameDuplicate = async () => {
    const response = await checkUsernameDuplicateApi(formData.username);
    setCheckInfo((prevState) => ({
      ...prevState,
      usernameDuplicate: response.data.can_use,
    }));
  };

  // 선생님 이메일 중복 확인
  const handleCheckEmailDuplicate = async () => {
    const response = await checkTeacherEmailDuplicateApi(formData.email);
    setCheckInfo((prevState) => ({
      ...prevState,
      emailDuplicate: response.data.can_use,
    }));
  };

  // 회원가입 버튼 눌렀을때 onChange로 실시간으로 폼에 들어감
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 만약 8자이상 16자이하라면 axios요청 보내기
    if (
      checkInfo.usernameDuplicate &&
      checkInfo.emailDuplicate &&
      checkInfo.passwordCoincidence
    ) {
      requestSignUp();
      toast.success("회원가입이 완료 되었습니다!", {
        position: "top-right",
      });
    } else {
      // 아니면 경고 alert
      toast.error("정보를 다시 입력해주세요!", {
        position: "top-right",
      });
    }
  };

  // 회원가입 요청 함수
  const requestSignUp = async () => {
    const formDataTosend: TeacherSignUpForm = {
      username: formData.username,
      password: formData.password,
      nickname: formData.nickname,
      email: formData.email,
      file: undefined,
    };

    // 회원 가입 api 요청
    const resultSignUpAction = await dispatch(signUpTeacher(formDataTosend));

    if (signUpTeacher.fulfilled.match(resultSignUpAction)) {
      // 회원가입 성공 시 로그인 시도
      const loginInfo: LoginForm = {
        username: resultSignUpAction.meta.arg.username,
        password: resultSignUpAction.meta.arg.password,
      };

      const resultLoginAction = await dispatch(loginSteach(loginInfo));

      if (loginSteach.fulfilled.match(resultLoginAction)) {
        // 로그인 성공 시 메인 페이지로 이동
        navigate("/home");
      } else {
        console.log("로그인에 실패하였습니다.");
      }
    } else {
      console.log("회원가입에 실패하였습니다.");
    }
  };

  return (
    <>
      <div>
        <img src={teacher} />
      </div>
      {status === "loading" ? (
        <SpinnerComponent />
      ) : (
        <form
          className="w-1/3 mx-auto border-2 rounded-xl p-6 mb-28"
          onSubmit={handleSubmit}
        >
          <section>
            <header className="flex items-center">
              <label htmlFor="username" className="text-2xl">
                아이디
              </label>
              <button
                className="m-3 p-2 rounded-md bg-red-200 text-white hover:bg-red-300"
                onClick={handleCheckUsernameDuplicate}
              >
                중복확인
              </button>
            </header>
            <main className="mb-2">
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="border-2 rounded-lg w-full p-2 mb-3"
                required
              />
              {checkInfo.usernameDuplicate && (
                <p className="mb-3 text-blue-500 text-sm">
                  사용 가능한 아이디입니다.
                </p>
              )}
              {checkInfo.usernameDuplicate === false && (
                <p className="mb-3 text-red-500 text-sm">
                  이미 존재하는 아이디입니다.
                </p>
              )}
            </main>
          </section>
          <section>
            <label htmlFor="password" className="text-2xl">
              비밀번호
            </label>
            <main className="mb-5">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="border-2 rounded-lg w-full p-2"
                required
              />
              {
                <p className="my-3 text-sm">
                  비밀번호는 띄어쓰기 없이 8 ~ 16자리여야 합니다.
                </p>
              }
            </main>
          </section>
          <section>
            <label htmlFor="confirmPassword" className="text-2xl">
              비밀번호 확인
            </label>
            <main className="mb-5">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleComfirmPassword}
                className="border-2 rounded-lg w-full p-2"
                required
              />
              {confirmPassword.length >= 8 &&
                16 >= confirmPassword.length &&
                (checkInfo.passwordCoincidence ? (
                  <p className="mt-2 text-sm text-blue-500">
                    비밀번호가 일치합니다.
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-red-500">
                    비밀번호가 일치하지 않습니다.
                  </p>
                ))}
              {confirmPassword.length > 16 && (
                <p className="mt-2 text-sm text-red-500">
                  비밀번호는 최대 16자리 이하여야 합니다.
                </p>
              )}
            </main>
          </section>
          <section>
            <header className="flex items-center">
              <label htmlFor="name" className="text-2xl">
                이름
              </label>
            </header>
            <main className="mb-2">
              <input
                type="text"
                id="nickname"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                className="border-2 rounded-lg w-full p-2 mb-3"
                required
              />
            </main>
          </section>
          <section>
            <header>
              <label htmlFor="email" className="text-2xl">
                이메일
              </label>
              <button
                type="button"
                className="m-3 p-2 rounded-md bg-red-200 text-white hover:bg-red-300"
                onClick={handleCheckEmailDuplicate}
              >
                중복확인
              </button>
            </header>
            <main className="mb-2">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border-2 rounded-lg w-full p-2 mb-3"
                required
              />
            </main>
            {checkInfo.emailDuplicate && (
              <p className="mb-3 text-blue-500 text-sm">
                사용 가능한 이메일입니다.
              </p>
            )}
            {checkInfo.emailDuplicate === false && (
              <p className="mb-3 text-red-500 text-sm">
                이미 존재하는 이메일입니다.
              </p>
            )}
          </section>
          <section>
            <label htmlFor="file" className="text-2xl">
              증명서
            </label>
            <main className="mb-2">
              <input
                type="file"
                id="file"
                name="file"
                onChange={handleChange}
                className="border-2 rounded-lg w-full p-2 mb-3"
              />
            </main>
          </section>
          <button
            type="submit"
            className="mt-3 w-full text-center bg-orange-300 p-2 rounded-lg hover:bg-orange-400 hover:text-white"
          >
            회원가입
          </button>
        </form>
      )}
    </>
  );
};

export default TeacherSignUp;
