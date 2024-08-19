import { useState } from "react";
import TeacherMyInfoForm from "./TeacherMyInfoForm";
import { passwordCheck } from "../../../api/user/userAPI";
import TeacherMyInfoUpdateForm from "./TeacherMyInfoUpdateForm";

const TeacherMyInfo: React.FC = () => {
  // 내정보 수정 여부
  const [isUpdateInfo, setIsUpdateInfo] = useState(false);

  // 비밀번호 확인이 된 후 내 정보 수정 폼을 띄우기 위한 핸들러 함수
  const handleIsUpdateInfo = async (password: string) => {
    const passwordAuthToken = await passwordCheck(password);

    localStorage.setItem(
      "passwordAuthToken",
      passwordAuthToken.password_auth_token
    );

    if (passwordAuthToken) {
      setIsUpdateInfo(true);
    } else {
      console.log("에러가 발생했습니다.");
    }
  };

  // 비밀번호를 확인하여 확인이 되면 내정보 폼을 띄워주는 용도
  return (
    <>
      {!isUpdateInfo && (
        <TeacherMyInfoForm handleIsUpdateInfoSubmit={handleIsUpdateInfo} />
      )}
      {isUpdateInfo && <TeacherMyInfoUpdateForm />}
    </>
  );
};

export default TeacherMyInfo;
