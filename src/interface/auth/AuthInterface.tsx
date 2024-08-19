// 학생 회원가입
export interface StudentSignUpForm {
  username: string;
  password: string;
  nickname: string;
  email: string;
  auth_code: string;
}

// 학생 인증 사항 체크 형식
export interface StudentCheckForm {
  usernameDuplicate: boolean | null;
  nicknameDuplicate: boolean | null;
  emailDuplicate: boolean | null;
  passwordCoincidence: boolean;
}

// 선생님 회원가입 폼 형식
export interface TeacherSignUpForm {
  username: string;
  password: string;
  nickname: string;
  email: string;
  file?: File;
}

// 선생님 인증 사항 체크 형식
export interface TeacherCheckForm {
  usernameDuplicate: boolean | null;
  emailDuplicate: boolean | null;
  passwordCoincidence: boolean;
}

// 통합 로그인 폼
export interface LoginForm {
  username: string;
  password: string;
}

// 통합 로그인 반환 폼
export interface LoginReturnForm {
  username: string;
  nickname: string;
  email: string;
  token: string;
  role: string;
}
