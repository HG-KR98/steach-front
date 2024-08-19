import noQuizimg from "../../../assets/noQuizImage.png";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const NoQuiz: React.FC = () => {
  const navigate = useNavigate();
  const { username, curricula_id, lecture_id } = useParams<{
    username: string;
    curricula_id: string;
    lecture_id: string;
  }>();

  return (
    <section className="flex justify-center items-center h-screen">
      <main className="text-center">
        <img src={noQuizimg} alt="no-image" className="mx-auto mb-6" />
        <button
          className="p-3 text-white font-semibold rounded-md bg-red-200 hover:bg-red-300"
          onClick={() =>
            navigate(
              `/teacher/profile/${username}/curricula/${curricula_id}/lecture/${lecture_id}/createQuiz`
            )
          }
        >
          퀴즈 생성하러가기
        </button>
      </main>
    </section>
  );
};

export default NoQuiz;
