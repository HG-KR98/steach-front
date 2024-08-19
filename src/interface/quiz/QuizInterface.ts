// 퀴즈 생성 내부 인터페이스
export interface QuizCreateDetailForm {
  quiz_number: number;
  question: string;
  choices: string[];
  answers: number;
}

// 퀴즈 단일 조회 인터페이스
export interface QuizDetailForm {
  quiz_id: number;
  lecture_id: number;
  quiz_number: number;
  question: string;
  choices: string[];
  answers: number;
  time: number;
}

// 퀴즈 수정 내부 인터페이스
export interface QuizUpdateDetailForm {
  quiz_number: number;
  question: string;
  choices: string[];
  answers: number;
}

// 강의에 대한 퀴즈 조회 인터페이스
export interface QuizFetchListForm {
  quiz_response_dtos: QuizDetailForm[];
}

// 퀴즈 생성 리스트 제출 인터페이스
export interface QuizCreateSendForm {
  // 수업 고유 ID
  lectureId: string | undefined;
  quiz_list: QuizCreateDetailForm[];
}

// 퀴즈 수정 리스트 제출 인터패이스
export interface QuizUpdateSendForm {
  lectureId: string | undefined;
  quiz_list: QuizUpdateDetailForm[];
}

// 퀴즈 생성 리스트 반환 인터페이스
export interface QuizCreateReturnForm {
  quiz_list: QuizCreateDetailForm[];
}

// 퀴즈 수정 리스트 반환 인터페이스
export interface QuizUpdateReturnForm {
  quiz_list: QuizDetailForm[];
}

// 퀴즈 상태 인터페이스
export interface QuizState {
  quizzes: QuizDetailForm[] | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
