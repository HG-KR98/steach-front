import { useState } from "react";
import { useDispatch } from "react-redux";
import { logout, deleteUserSteach } from "../../../store/userInfo/AuthSlice";
import { AppDispatch } from "../../../store";
import { useParams, useNavigate } from "react-router-dom";
import { deleteCurriculaDetail } from "../../../store/CurriculaSlice";

interface DeleteModalProps {
  purpose: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ purpose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { username, curricula_id } = useParams();

  // 삭제 및 회원탈퇴 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    setIsModalOpen(false);

    if (purpose === "curricula" && curricula_id) {
      // 커리큘럼 삭제
      await dispatch(deleteCurriculaDetail(curricula_id));
      // 내 강의실로 이동
      navigate(`/teacher/profile/${username}`);
      window.location.reload();
    } else {
      // 회원 탈퇴
      await dispatch(deleteUserSteach());

      // 탈퇴 후 로그아웃
      await dispatch(logout());

      // 메인페이지로 이동
      navigate("/");
      window.location.reload();
    }
  };

  return (
    <>
      {/* 회원탈퇴 */}
      {!isModalOpen && (purpose === "teacher" || purpose === "student") && (
        <button
          type="button"
          onClick={showModal}
          className="mx-2 p-3 font-semibold bg-red-400 text-white rounded-md shadow-md hover:bg-red-500"
        >
          회원탈퇴
        </button>
      )}
      {/* 모달 */}
      {isModalOpen && (purpose === "teacher" || purpose === "student") && (
        <form className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold text-gray-800">회원탈퇴</h2>
            <p className="text-gray-600 mt-4">
              정말로 회원탈퇴를 진행하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>

            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                탈퇴하기
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
              >
                취소
              </button>
            </div>
          </div>
        </form>
      )}

      {/* 커리큘럼 삭제 */}
      {!isModalOpen && purpose === "curricula" && (
        <button
          type="button"
          onClick={showModal}
          className="mx-2 p-3 bg-red-300 text-white font-semibold rounded-md shadow-md hover:bg-red-400"
        >
          커리큘럼 삭제
        </button>
      )}
      {isModalOpen && purpose === "curricula" && (
        <form className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold text-gray-800">삭제</h2>
            <p className="text-gray-600 mt-4">
              정말로 삭제를 진행하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>

            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                삭제하기
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
              >
                취소
              </button>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default DeleteModal;
