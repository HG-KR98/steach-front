// 검색 조건 보낼때 인터페이스
export interface SearchSendCurricula {
  curriculum_category: string;
  order: string;
  only_available: boolean;
  search: string;
  pageSize: number;
  currentPageNumber: number;
}

// 커리큘럼 검색 인터페이스
export interface SearchCurricula {
  curriculum_id: number;
  teacher_name: string;
  title: string;
  sub_title: string;
  intro: string;
  information: string;
  category: string;
  sub_category: string;
  banner_img_url: string;
  start_date: string;
  end_date: string;
  weekdays_bitmask: string;
  lecture_start_time: string;
  lecture_end_time: string;
  current_attendees: string;
  max_attendees: number;
  created_at: string;
}

// 커리큘럼 검색 반환 인터페이스
export interface SearchReturnCurricula {
  current_page_number: number;
  total_page: number;
  page_size: number;
  curricula: SearchCurricula[];
}

// 커리큘럼 검색 상태 인터페이스
export interface SearchCurriculaState {
  total_page: number;
  curricula: SearchCurricula[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
