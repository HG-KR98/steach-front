# 파일 구조 및 진행 상황
```xml
project/
├── src/
│   ├── components/
|   |   ├── user/
|   |   │   ├── IntroductionSignUp.tsx   # 회원가입 첫 화면 컴포넌트        - 완료
│   │   │   ├── StudentSignUp.tsx        # 학생 회원가입 컴포넌트           - 완료
│   │   │   └── TeacherSignUp.tsx        # 선생님 회원가입 컴포넌트         - 완료
│   │   ├── teacher/
│   │   │   ├── Profile.tsx              # 선생님 상세 프로필 컴포넌트      - 작업중
│   │   │   ├── ProfileUpdate.tsx        # 선생님 상세 프로필 수정 컴포넌트 - 작업중
│   │   │   ├── LectureScheduled.tsx     # 선생님 예정된 강의 컴포넌트      - 작업중
│   │   │   └── History.tsx              # 선생님 히스토리 컴포넌트         - 작업중
│   │   ├── student/
│   │   │   ├── CareerRecommendation.tsx # 학생 AI 진로추천 컴포넌트        - 완료
│   │   │   ├── MyInfo.tsx               # 학생 내 정보 컴포넌트            - 완료
│   │   │   ├── MyLecturePreference.tsx  # 학생 내 강의 선호도 컴포넌트     - 완료
│   │   │   ├── ProfileLectureHistory.tsx  # 학생 내 강의 히스토리 컴포넌트 - 완료
│   │   │   ├── ScheduledLectures.tsx    # 학생 내 강의 컴포넌트            - 완료
│   │   │   └── UpdateMyInfo.tsx         # 학생 내 정보 수정 컴포넌트       - 완료
│   │   ├── lecture/
│   │   │   ├── SignUp.tsx               # 강의 등록하기 컴포넌트           - 완료
│   │   │   ├── Detail.tsx               # 강의 상세페이지 컴포넌트         - 완료
│   │   │   └── DetailUpdate.tsx         # 강의 상세 수정페이지 컴포넌트    - 작업중
│   │   ├── meeting/ # 가장 중요한데 일단 수정 필요
│   │   │   ├── CreateRoom.tsx           # 화상 회의방 만들기 컴포넌트      - 07-22 부터 작업 예정
│   │   │   ├── Quiz.tsx                 # 퀴즈 컴포넌트                   - 07-22 부터 작업 예정
│   │   │   └── Chat.tsx                 # 화상회의 중 채팅                - 07-22 부터 작업 예정
│   │   └── main/
│   │       ├── Carousel.tsx             # 홈 페이지 캐러셀 컴포넌트        - 완료
│   │       ├── Footer.tsx               # 푸터                           - 완료
│   │       ├── HotLectures.tsx          # 인기 강의 데이터 컴포넌트        - 완료
│   │       ├── LatestLectures.tsx       # 최신 강의 데이터 컴포넌트        - 완료
│   │       ├── Navbar.tsx               # 네비바                          - 완료
│   │       └── Subjects.tsx              # 과목별 선택 버튼                - 완료
│   │       └── Spinner.tsx              # 스피너                          - 작업중
│   ├── pages/
|   │   ├── user/
│   │   │   ├── LoginPage.tsx            # 유저 로그인 페이지               - 완료(axios)
│   │   │   ├── SignUpPage.tsx           # 유저 회원가입 페이지             - 완료(axios)
│   │   ├── teacher/
│   │   │   ├── ProfilePage.tsx          # 선생님 상세 프로필 페이지        - 작업중
│   │   │   ├── ProfileUpdatePage.tsx    # 선생님 상세 프로필 수정 페이지   - 작업중
│   │   │   └── MyRoomPage.tsx           # 선생님 내 강의실 페이지          - 작업중
│   │   ├── student/
│   │   │   └── ProfilePage.tsx          # 학생 내 강의실 페이지            - 완료
│   │   ├── lecture/
│   │   │   ├── SignUpPage.tsx           # 강의 등록하기 페이지             -완료
│   │   │   ├── DetailPage.tsx           # 강의 상세페이지 페이지           -완료
│   │   │   └── DetailUpdatePage.tsx     # 강의 상세 수정페이지 페이지       -작업중
│   │   ├── meeting/ # 가장 중요한데 일단 수정 필요
│   │   │   └── RoomPage.tsx             # 화상 회의방 페이지               - 07-22 부터 작업 예정
│   │   └── main/
│   │       └── HomePage.tsx             # 홈페이지                        -완료
│   └── store/                           # 슬라이스
│       ├── lecturesSlice.tsx                                             - 작업중(axios)
│       └── teacherSlice.tsx                                              - 작업중(axios)  
├── store.tsx                            # 스토어                          - 작업중
└── tests/
```
