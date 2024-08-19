export interface Curricula {
  curriculum_id: string;
  teacher_id: string;
  title: string;
  sub_title: string;
  intro: string;
  information: string;
  category: string;
  sub_category: string;
  banner_img_url: string;
  start_date: string;
  end_date: string;
  lecture_start_time: string;
  lecture_end_time: string;
  weekdays_bitmask: any;
  max_attendees: number;
  teacher_name: string;
  current_attendees: string;
}

export interface HotCurricula {
  curriculum_id: number;
  banner_img_url: string;
  title: string;
  intro: string;
  max_attendees: number;
  current_attendees: number;
  created_at: string;
  teacher_name: string;
}

export interface CurriculaFormData {
  title: string;
  sub_title: string;
  intro: string;
  information: string;
  category: string;
  sub_category: string;
  banner_img_url: string | File;
  start_date: string;
  end_date: string;
  lecture_start_time: string;
  lecture_end_time: string;
  weekdays_bitmask: any;
  max_attendees: number;
}

// 강의 리스트 인터페이스
export interface LectureSeries {
  lecture_count: number;
  week_count: number;
  lectures: Lectures[];
}

// 강의 배열 인터페이스
export type Lectures = Array<{
  lecture_id: number;
  lecture_title: string;
  lecture_order: number;
  lecture_start_time: string;
  lecture_end_time: string;
  is_completed: boolean;
}>;

// 단일 강의 인터페이스
export interface Lecture {
  lecture_id: number;
  lecture_title: string;
  lecture_order: number;
  lecture_start_time: string;
  lecture_end_time: string;
  is_completed: boolean;
}

// 강의 상세 수정 인터페이스
export interface PatchLecture {
  lecture_id: number | undefined;
  lecture_title: string | undefined;
  lecture_start_time: string | undefined;
  lecture_end_time: string | undefined;
}

// 인기 커리큘럼 리스트 조회 폼
export interface returnHotCurriculaList {
  current_page_number: number;
  total_page: number;
  page_size: number;
  curricula: Curricula[];
}

// 최신 커리큘럼 리스트 조회
export interface returnLastestCurriculaList {
  current_page_number: number;
  total_page: number;
  page_size: number;
  curricula: Curricula[];
}

export interface returnStudentCurriculaList {
  current_page_number: number;
  total_page: number;
  page_size: number;
  curricula: Curricula[];
}

// 선생님이 강의하는 커리큘럼 조회 폼
export interface returnTeacherCurriculaList {
  current_page_number: number;
  total_page: number;
  page_size: number;
  curricula: Curricula[];
}

export interface PageInterface {
  page: number;
  nowpage: number;
}

export interface StudentQuizDto {
  score: number;
  student_choice: string;
}

export interface StudentInfoByLectureDto {
  student_name: string;
  student_quiz_by_lecture_dtos: StudentQuizDto[];
  focus_ratio: number;
  focus_minute: number;
  total_quiz_score: number;
  correct_number: number;
}

export interface LectureReport {
  student_info_by_lecture_dto_list: StudentInfoByLectureDto[];
  average_focus_ratio: number;
  average_focus_minute: number;
  average_total_quiz_score: number;
  average_correct_number: number;
}
