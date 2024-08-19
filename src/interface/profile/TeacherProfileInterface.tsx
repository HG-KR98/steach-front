import { Curricula } from "../Curriculainterface";

// 선생님 정보 형식
export interface TeacherInfo {
  username: string | null;
  nickname: string;
  email: string;
  volunteer_time: number;
  brief_introduction: string | null;
  academic_background: string | null;
  specialization: string | null;
}

// 선생님의 기본 상태 정보 형식
export interface TeacherUserInfo {
  status: string;
  error: string | null;
  info: TeacherInfo | null;
  curricula: Curricula[];
}
