import React, { useEffect, useRef, useState } from "react";
import WebrtcTeacher from "./WebrtcTeacher";
import WebrtcStudent from "./WebrtcStudent";
import { useParams } from "react-router-dom";
import { startLectureSlice } from "../../store/LectureSlice";
import { AppDispatch } from "../../store";
import { useDispatch } from "react-redux";
import cam from "../../assets/RTC/cam.png";
import nocam from "../../assets/RTC/no_cam.png";

const Classroom = () => {
  const [page, setPage] = useState("gate");
  const [roomId, setRoomId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [role, setRole] = useState("");
  const [hidden, setHidden] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const { lecture_id } = useParams<string>();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream>();

  useEffect(() => {
    const setupLocalStream = async () => {
      try {
        const localStream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            width: 1920,
            height: 1080,
          },
        });
        localStreamRef.current = localStream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }
      } catch (error) {
        console.error("Error accessing media devices.", error);
      }
    };

    setupLocalStream();
  }, []);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const localStorageUserData = localStorage.getItem("auth");
    const userData = localStorageUserData
      ? JSON.parse(localStorageUserData)
      : null;
    if (userData?.email && lecture_id) {
      setRole(userData.role);
      setRoomId(lecture_id);
      setUserEmail(userData.nickname);
    }
  }, [lecture_id]);

  useEffect(() => {});

  const handleEnterClick = () => {
    if (role === "") {
      alert("Please choose a role.");
      return;
    } else if (role === "TEACHER") {
      if (lecture_id) {
        localStorage.removeItem("prevRankData");
        setPage("WebrtcTeacher");
        dispatch(startLectureSlice(lecture_id));
        setHidden(1);
        setIsVisible(false);
      }
    } else if (role === "STUDENT") {
      localStorage.removeItem("prevRankData");
      setPage("WebrtcStudent");
      setHidden(1);
      setIsVisible(false);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setVideoEnabled(videoTrack.enabled);
    }
  };

  return (
    <div className="flex flex-col bg-discordChatBg min-h-screen">
      {isVisible && (
        <>
          <header className=" text-white text-center font-bold sm:my-8 sm:text-3xl md:my-10 md:text-4xl lg:my-auto lg:text-4xl">
            강의실에 입장하기 전 자신의 용모를 확인하세요!
          </header>
          <section className="flex justify-center items-center sm:mx-10">
            <video
              className="bg-black rounded-2xl lg:size-1/3"
              ref={localVideoRef}
              autoPlay
              controls={false}
            />
          </section>
          <div className="flex justify-center">
            <button
              onClick={toggleVideo}
              className="p-2 flex items-center justify-center border-2 border-white w-14 h-14 bg-[#262626] rounded-full my-10"
              title="Toggle Video"
            >
              {videoEnabled ? (
                <img src={`${cam}`} className="w-8 h-8" />
              ) : (
                <img src={`${nocam}`} className="w-8 h-8" />
              )}
            </button>
          </div>
        </>
      )}

      <div id="gate">
        <div className="hidden">
          <select
            id="role_select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="" disabled>
              Choose...
            </option>
            <option value="TEACHER">Teacher</option>
            <option value="STUDENT">Student</option>
          </select>
          <input
            type="text"
            id="tb_roomid"
            value={lecture_id}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter Room ID"
          />
          <input
            type="text"
            id="tb_email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="Enter Email"
          />
        </div>
        <div className="my-12 text-center">
          <button
            id="btn_enter"
            onClick={handleEnterClick}
            className={
              hidden === 1
                ? "hidden"
                : "p-5 w-48 bg-[#787878] rounded-md text-white font-bold hover:bg-[#898989] whitespace-nowrap"
            }
          >
            강의실 입장하기
          </button>
        </div>
        <div className="flex-grow flex items-center justify-center">
          {page === "WebrtcTeacher" && (
            <WebrtcTeacher
              roomId={roomId}
              userEmail={userEmail}
              userRole={role}
            />
          )}
          {page === "WebrtcStudent" && (
            <WebrtcStudent
              roomId={roomId}
              userEmail={userEmail}
              userRole={role}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Classroom;
