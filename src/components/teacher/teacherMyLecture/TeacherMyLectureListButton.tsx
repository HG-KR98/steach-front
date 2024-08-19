import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Button,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import TeacherMyLectureListModal from "./TeacherMyLectureListModal";

// prop으로 들어올 요소의 interface 타입 지정
interface TeacherMyLectureListButtonProps {
  lectureState: string;
  lectureId: number | undefined;
  curriculaId: string | undefined;
  username: string | undefined;
}

const TeacherMyLectureListButton: React.FC<TeacherMyLectureListButtonProps> = ({
  lectureState,
  lectureId,
  curriculaId,
  username,
}) => {
  const navigate = useNavigate();

  return (
    <>
      {lectureState === "completed" && (
        <>
          <Button
            className="mx-auto p-3 bg-sky-300 rounded-md shadow text-white font-semibold hover:bg-sky-400"
            onClick={() =>
              navigate(
                `/teacher/profile/${username}/curricula/${curriculaId}/lecture/${lectureId}/lectureReport`
              )
            }
          >
            리포트 보기
          </Button>
          <div className="mx-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
              />
            </svg>
          </div>
        </>
      )}
      {lectureState === "scheduled" && (
        <>
          <p className="mx-auto p-3 text-sm text-red-500 text-center font-semibold">
            예정된 강의
          </p>
          <Popover placement="right-start">
            <PopoverTrigger>
              <Button className="mx-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-7 text-center"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-6 bg-green-100 relative rounded-md shadow-md z-10">
              <PopoverArrow />
              <PopoverCloseButton className="absolute top-2 right-3" />
              <PopoverBody className="grid grid-cols-1">
                <TeacherMyLectureListModal lectureId={lectureId} />
                <Button
                  className="m-3"
                  onClick={() =>
                    navigate(
                      `/teacher/profile/${username}/curricula/${curriculaId}/lecture/${lectureId}/quiz`
                    )
                  }
                >
                  퀴즈 관리
                </Button>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </>
      )}
      {lectureState === "ongoing" && (
        <>
          <Button
            className="mx-auto p-3 bg-sky-300 rounded-md shadow text-white font-semibold hover:bg-pink-400"
            onClick={() => {
              navigate(`/classroom/${lectureId}`);
              history.replaceState(null, '', window.location.href);
              window.location.reload();
            }}
          >
            강의실 입장하기
          </Button>
          <Popover placement="right-start">
            <PopoverTrigger>
              <Button className="mx-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-7 text-center"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-6 bg-green-100 relative rounded-md shadow-md z-10">
              <PopoverArrow />
              <PopoverCloseButton className="absolute top-2 right-3" />
              <PopoverBody className="grid grid-cols-1">
                <TeacherMyLectureListModal lectureId={lectureId} />
                <Button
                  className="m-3"
                  onClick={() =>
                    navigate(
                      `/teacher/profile/${username}/curricula/${curriculaId}/lecture/${lectureId}/quiz`
                    )
                  }
                >
                  퀴즈 관리
                </Button>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </>
      )}
    </>
  );
};

export default TeacherMyLectureListButton;
