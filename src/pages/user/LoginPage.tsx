import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginSteach } from "../../store/userInfo/AuthSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { toast } from "react-toastify";
import LoginBannerBgImg from "../../assets/banner.jpg";

// 이진송
// 디자인 변경 필요함
const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // 로그인 폼 형식
  interface FormData {
    username: string;
    password: string;
  }

  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });

  // 양방향 바인딩을 위한 핸들러 함수
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loginFormData: FormData = {
      username: formData.username,
      password: formData.password,
    };

    const loginResult = await dispatch(loginSteach(loginFormData));
    if (loginResult.type === "login/fulfilled") {
      navigate("/home");
    } else {
      toast.error("비밀번호가 틀렸습니다!", {
        position: "top-right",
      });
    }
  };

  return (
    <>
      <div
        className="main-content flex flex-col min-h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${LoginBannerBgImg})` }}
      >
        <div className="flex-grow flex items-center justify-center">
          <form
            className="w-full max-w-md mx-auto p-6 bg-white shadow-md rounded-lg"
            onSubmit={handleSubmit}
          >
            <div>
              <label
                htmlFor="username"
                className="block text-lg font-semibold mb-2"
              >
                아이디
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full border-2 rounded-lg p-2 mb-4"
                required
              />
              <label
                htmlFor="password"
                className="block text-lg font-semibold mb-2"
              >
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border-2 rounded-lg p-2 mb-4"
                required
              />
              <button
                type="submit"
                className="w-full bg-orange-400 text-white p-2 rounded-lg hover:bg-orange-500 mb-2"
              >
                로그인
              </button>
              <button
                type="button"
                className="w-full bg-gray-400 text-white p-2 rounded-lg hover:bg-gray-500"
                onClick={() => navigate("/user/signup")}
              >
                회원가입
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
