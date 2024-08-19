import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signUpStudent, loginSteach } from "../../../store/userInfo/AuthSlice";
import { AppDispatch, RootState } from "../../../store";
import {
  checkUsernameDuplicateApi,
  checkNicknameDuplicateApi,
  checkStudentEmailDuplicateApi,
} from "../../../api/user/userAPI";
import {
  StudentSignUpForm,
  LoginForm,
  StudentCheckForm,
} from "../../../interface/auth/AuthInterface";
import student from "../../../assets/student.png";
import SpinnerComponent from "../../main/spinner/Spinner";

// 학생 회원가입 컴포넌트
const StudentSignUp: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // 회원 인증 상태 및 에러
  const { status } = useSelector((state: RootState) => state.auth);

  // 데이터를 담기 위한 박스 개념, 함수를 위의 interface에 맞춰서 작성
  const [formData, setFormData] = useState<StudentSignUpForm>({
    username: "",
    password: "",
    nickname: "",
    email: "",
    auth_code: "",
  });

  // 비밀번호 확인
  const [confirmPassword, setComfirmPassword] = useState("");

  // 각종 검증 데이터 상태
  const [checkInfo, setCheckInfo] = useState<StudentCheckForm>({
    usernameDuplicate: null,
    nicknameDuplicate: null,
    emailDuplicate: null,
    passwordCoincidence: false,
  });

  // 아이디 중복 체크 호출 핸들러 함수
  const handleCheckUsernameDuplicate = async () => {
    const response = await checkUsernameDuplicateApi(formData.username);
    setCheckInfo((prevState) => ({
      ...prevState,
      usernameDuplicate: response.data.can_use,
    }));
  };

  // 닉네임 중복 체크 호출 핸들러 함수
  const handleCheckNicknameDuplicate = async () => {
    const response = await checkNicknameDuplicateApi(formData.nickname);
    setCheckInfo((prevState) => ({
      ...prevState,
      nicknameDuplicate: response.data.can_use,
    }));
    console.log(response);
  };

  // 이메일 중복 체크 호출 핸들러 함수
  const handleCheckEmailDuplicate = async () => {
    const response = await checkStudentEmailDuplicateApi(formData.email);
    setCheckInfo((prevState) => ({
      ...prevState,
      emailDuplicate: response.data.can_use,
    }));
  };

  //사용자가 값을 입력할 때 마다, onChange로 데이터가 입력됨.
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 비밀번호 확인 양방향 바인딩
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

  // 제출을 했을때 나타나는 이벤트
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // 만약 8자이상 16자이하라면 axios요청 보내기
    if (
      checkInfo.usernameDuplicate &&
      checkInfo.nicknameDuplicate &&
      checkInfo.emailDuplicate &&
      checkInfo.passwordCoincidence
    ) {
      requestSignUp();
    } else {
      // 아니면 경고 alert
      console.log("정보를 다시 입력해주세요");
    }
  };

  // 회원가입 요청 함수
  const requestSignUp = async () => {
    const formDataToSend: StudentSignUpForm = {
      username: formData.username,
      password: formData.password,
      nickname: formData.nickname,
      email: formData.email,
      auth_code: formData.auth_code,
    };

    // 회원 가입 api 요청
    const resultSignUpAction = await dispatch(signUpStudent(formDataToSend));

    if (signUpStudent.fulfilled.match(resultSignUpAction)) {
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
        <img src={student} />
      </div>
      {status === "loading" ? (
        <SpinnerComponent />
      ) : (
        <form
          className="w-1/3 mx-auto border-2 rounded-xl p-6 mb-28"
          onSubmit={handleSubmit}
        >
          <section className="mb-3">
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
              비밀번호확인
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
              <label htmlFor="nickname" className="text-2xl">
                닉네임
              </label>
              <button
                type="button"
                className="m-3 p-2 rounded-md bg-red-200 text-white hover:bg-red-300"
                onClick={handleCheckNicknameDuplicate}
              >
                중복확인
              </button>
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
              {checkInfo.nicknameDuplicate && (
                <p className="mb-3 text-blue-500 text-sm">
                  사용 가능한 닉네임입니다.
                </p>
              )}
              {checkInfo.nicknameDuplicate === false && (
                <p className="mb-3 text-red-500 text-sm">
                  이미 존재하는 닉네임입니다.
                </p>
              )}
            </main>
          </section>
          <section className="mb-3">
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
            </main>
          </section>
          <section>
            <label htmlFor="auth_code" className="text-2xl">
              인증코드
            </label>
            <main className="mb-2">
              <input
                type="text"
                id="auth_code"
                name="auth_code"
                value={formData.auth_code}
                onChange={handleChange}
                className="border-2 rounded-lg w-full p-2 mb-3"
                required
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

export default StudentSignUp;
