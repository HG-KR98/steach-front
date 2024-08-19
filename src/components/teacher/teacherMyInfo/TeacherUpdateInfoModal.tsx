import { useState } from "react";

interface TeacherUpdateInfoModalProps {
  handleIsUpdateInfoSubmit: (password: string) => void;
}

const TeacherUpdateInfoModal: React.FC<TeacherUpdateInfoModalProps> = ({
  handleIsUpdateInfoSubmit,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // 비밀번호 입력 바인딩
  const [passwordInput, setPassordInput] = useState("");

  const handlePasswordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassordInput(e.target.value);
  };

  // 비밀번호 확인 요청 메서드
  const handlePasswordCheck = (e: React.FormEvent) => {
    e.preventDefault();
    handleIsUpdateInfoSubmit(passwordInput);
    closeModal();
  };

  return (
    <div className="absolute top-7 right-5">
      <button
        onClick={openModal}
        className="p-4 text-white font-semibold bg-indigo-200 rounded-md hover:bg-indigo-300"
      >
        내정보 수정
      </button>

      {isOpen && (
        <form onSubmit={(e) => handlePasswordCheck(e)}>
          <div
            className="relative z-10"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-6 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <h3
                          className="mb-3 text-2xl font-semibold leading-6 text-gray-900"
                          id="modal-title"
                        >
                          비밀번호 확인
                        </h3>
                        <div className="mt-4">
                          <input
                            type="password"
                            className="p-2 border-2 rounded-md"
                            placeholder="비밀번호를 입력해주세요."
                            value={passwordInput}
                            onChange={(e) => handlePasswordInput(e)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      onClick={closeModal}
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={(e) => handlePasswordCheck(e)}
                    >
                      확인
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default TeacherUpdateInfoModal;
