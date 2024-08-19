import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  KeyboardEvent,
} from "react";
import io from "socket.io-client";
import WebRTCVideo from "../../components/video/index.tsx";
import { WebRTCUser } from "../../types/index.ts";
import WebrtcStudentScreenShare from "./WebrtcStudentScreenShare.tsx";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store.tsx";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./WebrtcStudent.module.css";
import html2canvas from "html2canvas";
import { QuizDetailForm } from '../../interface/quiz/QuizInterface.ts';
import DetailQuiz from '../../components/quiz/QuizBlock.tsx';
import { studentFocusTime } from '../../store/MeetingSlice.tsx'
import { BASE_URL, getAuthToken } from "../../api/BASE_URL.ts";
import axios from "axios";
import { finalLectureSlice } from "../../store/LectureSlice.tsx";
import alarmImage from '../../assets/alarm.png';
import alarmAudio from '../../assets/alarm.mp3';
import comebackImage from '../../assets/comeback.png';
import comebackAudio from '../../assets/comeback.mp3';
import lecture_close from "../../assets/RTC/lecture_close.png"
import cam from "../../assets/RTC/cam.png"
import nocam from "../../assets/RTC/no_cam.png"
import mic from "../../assets/RTC/mic.png"
import nomic from "../../assets/RTC/no_mic.png"
import screenShare from "../../assets/RTC/screen.png"
import noScreenShare from "../../assets/RTC/no_screen.png"
import chat from "../../assets/RTC/chat.png"
import noChat from "../../assets/RTC/no_chat.png"

const pc_config = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
const SOCKET_SERVER_URL = `${protocol}//${window.location.hostname}:${
  window.location.port ? window.location.port : "5000"
}`;

interface WebrtcProps {
  roomId: string;
  userEmail: string;
  userRole: string;
}

let audioElement: HTMLAudioElement | null = null;
let isAlarmActive = false;

export const startAlarm = (type: 'comeback' | 'sleep') => {
	if (isAlarmActive) return; // If alarm is already active, return
	isAlarmActive = true;

	const alarmElement = document.createElement('div');
	alarmElement.id = 'alarmElement';
	alarmElement.style.zIndex = '9999';
	alarmElement.style.position = 'fixed';
	alarmElement.style.top = '0';
	alarmElement.style.left = '0';
	alarmElement.style.width = '100vw';
	alarmElement.style.height = '100vh';
	alarmElement.style.display = 'flex';
	alarmElement.style.flexDirection = 'column';
	alarmElement.style.alignItems = 'center';
	alarmElement.style.justifyContent = 'center';
	alarmElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Optional background overlay

	const imgElement = document.createElement('img');
	imgElement.src = type === 'comeback' ? comebackImage : alarmImage;
	imgElement.id = 'shakingImage';
	imgElement.style.width = 'min(50vw, 70%)'; // Use 50% of viewport width or 70% of container width
	imgElement.style.maxWidth = '300px'; // Set a max width to prevent it from being too large on smaller screens
	imgElement.style.height = 'auto'; // Maintain aspect ratio
	imgElement.style.marginBottom = '20px'; // Add 20px space below the image

	const alarmTextElement = document.createElement('p');
	alarmTextElement.style.fontSize = 'min(10vw, 15vw, 50px)'; // Responsive font size based on viewport width
	alarmTextElement.style.color = 'white';
	alarmTextElement.style.textShadow = '2px 2px 4px black'; // Add shadow to make text visible on any background
	alarmTextElement.textContent = type === 'comeback' ? '화면에 집중하세요!' : '일어나세요!';
	alarmTextElement.style.margin = '0'; // Remove default margins
	alarmTextElement.style.textAlign = 'center'; // Center-align text

	alarmElement.appendChild(imgElement);
	alarmElement.appendChild(alarmTextElement);

	document.body.appendChild(alarmElement);

	const animationForSleep = [
		{ transform: 'rotate(20deg)' },
		{ transform: 'rotate(0deg)', offset: 0.25 },
		{ transform: 'rotate(20deg)', offset: 0.5 },
		{ transform: 'rotate(40deg)', offset: 0.75 },
		{ transform: 'rotate(20deg)' }
	];

	const animationForAFK = [
		{ transform: 'rotate(0deg)' },
		{ transform: 'rotate(-20deg)', offset: 0.25 },
		{ transform: 'rotate(0deg)', offset: 0.5 },
		{ transform: 'rotate(20deg)', offset: 0.75 },
		{ transform: 'rotate(0deg)' }
	];

	imgElement.animate(type === 'comeback' ? animationForAFK : animationForSleep, {
		duration: 400, // Total duration of one complete shake cycle
		iterations: Infinity
	});

	if (!audioElement) {
		audioElement = new Audio(type === 'comeback' ? comebackAudio : alarmAudio);
		audioElement.loop = true; // Loop the audio indefinitely
		audioElement.play().catch(error => console.error('Audio play error:', error)); // Catch any play errors
	}
};

export const stopAlarm = () => {
	const alarmElement = document.getElementById('alarmElement');
	if (alarmElement) {
		alarmElement.remove(); // Remove the image from the DOM
	}
	if (audioElement) {
		audioElement.loop = false;
		audioElement.pause();
		audioElement.currentTime = 0;
		audioElement = null;
	}
	isAlarmActive = false; // Reset the flag
};

const WebrtcStudent: React.FC<WebrtcProps> = ({
												  roomId,
												  userEmail,
												  userRole,
											  }) => {
	const socketRef = useRef<SocketIOClient.Socket>();
	const pcsRef = useRef<{ [socketId: string]: RTCPeerConnection }>({});
	const localVideoRef = useRef<HTMLVideoElement>(null);
	const localStreamRef = useRef<MediaStream>();
	const [users, setUsers] = useState<WebRTCUser[]>([]);
	const [isVideoEnabled, setIsVideoEnabled] = useState(false);
	const [isAudioEnabled, setIsAudioEnabled] = useState(false);
	const [isAudioDisabledByTeacher, setIsAudioDisabledByTeacher] =
		useState(false);
	const [isScreenShareEnabled, setIsScreenShareEnabled] = useState(false);
	const [isScreenShareDisabledByTeacher, setIsScreenShareDisabledByTeacher] =
		useState(false);
	const [messages, setMessages] = useState<string[]>([]);
	const [newMessage, setNewMessage] = useState("");
	const [goScreenShare, setGoScreenShare] = useState(false);
	const [screenShareStopSignal, setScreenShareStopSignal] = useState(false);
	const [isMuted, setIsMuted] = useState(true);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [showControls, setShowControls] = useState(false);
	const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);
	const [isChatOpen, setIsChatOpen] = useState(false);
	const dispatch = useDispatch<AppDispatch>();
	const { lecture_id } = useParams();

	const divRef = useRef<HTMLDivElement>(null);
	const MAX_WIDTH = 854;
	const MAX_HEIGHT = 480;
	const TOLERANCE = 3; // 16초
	const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
	const [accDdResult, setAccDdResult] = useState<number[]>([]);
	const [cntAFK, setCntAFK] = useState<number>(0);
	const [cntFocus, setCntFocus] = useState<number>(0);
	const [cntDrowsy, setCntDrowsy] = useState<number>(0);
	const [notFocusTime, setNotFocusTime] = useState<number>(0);
  const [sleepTime, setSleepTime] = useState<number>(0);
  
  const closeLecture = () => { 
    localStorage.removeItem('prevRankData')
    window.location.replace('/home')
  }


	// let audioElement: HTMLAudioElement | null = null;

  // console.log('sleepTime',sleepTime)

	//퀴즈모달 ======================================
	//퀴즈모달 출력 여부
	const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

	//퀴즈모달 닫기
	const handleCloseQuizModal = () => {
		setIsQuizModalOpen(false);
		setSelectedQuiz(null);
	};

	//현재 퀴즈
	const [selectedQuiz, setSelectedQuiz] = useState<QuizDetailForm | null>(null);
	//==============================================

  //선생님이 퀴즈를 시작했을 때 rtc에서 호출하는 함수
  const openQuiz = async (quizId: string) => {
    const token = getAuthToken();
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/quizzes/${quizId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSelectedQuiz(response.data);
      setIsQuizModalOpen(true);
    } catch (err) {
      console.log(err);
    }
  };

	useEffect(() => {
		const handleUserInteraction = () => {
			stopAlarm();
		};

		document.addEventListener('mousemove', handleUserInteraction);
		document.addEventListener('keydown', handleUserInteraction);

		return () => {
			document.removeEventListener('mousemove', handleUserInteraction);
			document.removeEventListener('keydown', handleUserInteraction);
		};
	}, []);

	const getDrowsiness = async () => {
		if (!divRef.current) return;

		try {
			const div = divRef.current;
			const canvas = await html2canvas(div, { scale: 2 });

			const originalWidth = canvas.width;
			const originalHeight = canvas.height;
			let width = originalWidth;
			let height = originalHeight;

			if (originalWidth > MAX_WIDTH || originalHeight > MAX_HEIGHT) {
				const widthRatio = MAX_WIDTH / originalWidth;
				const heightRatio = MAX_HEIGHT / originalHeight;
				const scaleRatio = Math.min(widthRatio, heightRatio);

				width = originalWidth * scaleRatio;
				height = originalHeight * scaleRatio;
			}

			const resizedCanvas = document.createElement("canvas");
			resizedCanvas.width = width;
			resizedCanvas.height = height;
			const ctx = resizedCanvas.getContext("2d");

			if (ctx) {
				ctx.drawImage(canvas, 0, 0, width, height);
			}

      resizedCanvas.toBlob((blob) => {
        if (blob !== null) {
          const formData = new FormData();
          // saveAs(blob, "res.png");
          formData.append("file", blob, "focus.png");

					// Upload the resized image
					fetch("https://steach.ssafy.io/drowsiness", {
						method: "POST",
						body: formData,
					})
						.then((response) => response.text())
						.then((result) => {
							saveAccddRes(parseInt(result, 10));
						})
						.catch((error) => {
							console.error("[Drowsiness Detection] Error:", error);
						});
				}
			});
		} catch (error) {
			console.error("Error converting div to image:", error);
		}
  };
  


	const saveAccddRes = (value: number) => {
		// First, update the counts based on the new value
		setCntAFK((prevCntAFK) => (value === -1 ? prevCntAFK + 1 : prevCntAFK));
		setCntFocus((prevCntFocus) => (value === 0 ? prevCntFocus + 1 : prevCntFocus));
		setCntDrowsy((prevCntDrowsy) => (value === 1 ? prevCntDrowsy + 1 : prevCntDrowsy));
		setNotFocusTime((prevNotFocusTime) => (value === -1 || value === 1 ? prevNotFocusTime + 1 : prevNotFocusTime));
		setSleepTime(Math.floor(notFocusTime * 2 / 60))

		setAccDdResult((prevValues) => {
			// Add the new value to the array
			const updatedValues = [...prevValues, value];

			// If the length exceeds TOLERANCE, we need to adjust counts
			if (updatedValues.length > TOLERANCE) {
				const firstOfAccDdRes = updatedValues.shift(); // Remove the oldest value and adjust counts

				// Adjust counts based on the removed value
				setCntAFK((prevCntAFK) => (firstOfAccDdRes === -1 ? prevCntAFK - 1 : prevCntAFK));
				setCntFocus((prevCntFocus) => (firstOfAccDdRes === 0 ? prevCntFocus - 1 : prevCntFocus));
				setCntDrowsy((prevCntDrowsy) => (firstOfAccDdRes === 1 ? prevCntDrowsy - 1 : prevCntDrowsy));
			}

			// Return the updated array to setAccDdResult
			return updatedValues;
		});
	};

	useEffect(() => {
		const calculatedSleepTime = Math.floor(notFocusTime * 2 / 60);
		console.log('calculatedSleepTime', calculatedSleepTime)
		if (calculatedSleepTime !== sleepTime && calculatedSleepTime > 0) {
			setSleepTime(calculatedSleepTime);
		}
	}, [notFocusTime])

	useEffect(() => {
		if (sleepTime > 0 && lecture_id) {
			dispatch(studentFocusTime({lecture_Id: lecture_id, sleepTimeData: {sleep_time: sleepTime}}))
			console.log("sleepTime 전송")
		}
	}, [sleepTime, dispatch]);

	useEffect(() => {
		if (cntAFK >= TOLERANCE) {
			setCntAFK(0);
			setCntFocus(0);
			setCntDrowsy(0);
			setAccDdResult([]); // Clear the accDdResult array
			askComeBack();
			reportToTeacher('afk');
		} else if (cntDrowsy >= TOLERANCE) {
			setCntAFK(0);
			setCntFocus(0);
			setCntDrowsy(0);
			setAccDdResult([]); // Clear the accDdResult array
			wakeStudent();
			reportToTeacher('sleep');
		}
	}, [cntAFK, cntDrowsy]); // Dependencies array to watch for changes

	const reportToTeacher = (type: string) => {
		if (socketRef.current) {
			socketRef.current.emit('report_to_teacher', {
				userId: socketRef.current.id,
				email: userEmail,
				type: type
			});
		}
	}


	const startDrowsinessDetection = () => {
		if (!intervalId) {
			const id = setInterval(getDrowsiness, 2000);
			setIntervalId(id);
		}
		setCntAFK(0);
		setCntDrowsy(0);
	};

	const stopDrowsinessDetection = () => {
		if (intervalId) {
			clearInterval(intervalId);
			setIntervalId(null);
		}
		setCntAFK(0);
		setCntDrowsy(0);
	};

	const askComeBack = () => {
		console.log(`[Focus Detection] Away From Keyboard for ${TOLERANCE * 2}초 detected!!!`);
		startAlarm('comeback');

	}

	const wakeStudent = () => {
		console.log(`[Drowsiness Detection] Drowsy for ${TOLERANCE * 2}초 detected!!!`);
		startAlarm('sleep');

	}


	const toggleScreenShare = () => {
		if(!goScreenShare){
			setScreenShareStopSignal(false);
			toggleScreenShareFunc();
		}else{
			setScreenShareStopSignal(true);
		}
	}

	const toggleScreenShareFunc = () => {
		if(goScreenShare){
			setGoScreenShare(false);
			setIsScreenShareEnabled(false);
			if (socketRef.current) {
				socketRef.current.emit('toggle_media', {
					userId: socketRef.current.id,
					email: userEmail,
					videoEnabled: isVideoEnabled,
					audioEnabled: isAudioEnabled,
					audioDisabledByTeacher: isAudioDisabledByTeacher,
					screenShareEnabled: false,
					screenShareDisabledByTeacher: isScreenShareDisabledByTeacher
				});
			}
		}else{
			setGoScreenShare(true);
			setIsScreenShareEnabled(true);
			if (socketRef.current) {
				socketRef.current.emit('toggle_media', {
					userId: socketRef.current.id,
					email: userEmail,
					videoEnabled: isVideoEnabled,
					audioEnabled: isAudioEnabled,
					audioDisabledByTeacher: isAudioDisabledByTeacher,
					screenShareEnabled: true,
					screenShareDisabledByTeacher: isScreenShareDisabledByTeacher
				});
			}
		}
	}

	const getLocalStream = useCallback(async () => {
		try {
			const localStream = await navigator.mediaDevices.getUserMedia({
				audio: true,
				video: {
					width: 1920,
					height: 1080,
				},
			});
			localStreamRef.current = localStream;
			if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
			if (!socketRef.current) return;

			const videoTrack = localStreamRef.current?.getVideoTracks()[0];
			const audioTrack = localStreamRef.current?.getAudioTracks()[0];
			videoTrack.enabled = false;
			audioTrack.enabled = false;

			socketRef.current.emit('join_room', {
				room: roomId,
				email: userEmail,
				userRole: userRole,
				videoEnabled: false,
				audioEnabled: false,
				audioDisabledByTeacher: false
			});
		} catch (e) {
			console.log(`getUserMedia error: ${e}`);
		}
	}, [roomId, userEmail, userRole]);

	const createPeerConnection = useCallback((socketID: string, email: string, role: string, videoEnabled: boolean, audioEnabled: boolean, audioDisabledByTeacher: boolean, screenShareEnabled: boolean, screenShareDisabledByTeacher: boolean) => {
		try {
			const pc = new RTCPeerConnection(pc_config);
			if(email === userEmail + '_screen') return;

			pc.onicecandidate = (e) => {
				if (socketRef.current && e.candidate) {
					socketRef.current.emit('candidate', {
						candidate: e.candidate,
						candidateSendID: socketRef.current.id,
						candidateReceiveID: socketID,
					});
				}
			};

			pc.oniceconnectionstatechange = (e) => {
				console.log(e);
			};

			pc.ontrack = (e) => {
				setUsers((oldUsers) =>
					oldUsers
						.filter((user) => user.id !== socketID)
						.concat({
							id: socketID,
							email,
							userRole: role,
							stream: e.streams[0],
							videoEnabled: videoEnabled,
							audioEnabled: audioEnabled,
							audioDisabledByTeacher: audioDisabledByTeacher,
							screenShareEnabled: screenShareEnabled,
							screenShareDisabledByTeacher: screenShareDisabledByTeacher
						}),
				);
			};

			if (localStreamRef.current) {
				localStreamRef.current.getTracks().forEach((track) => {
					if (localStreamRef.current) {
						pc.addTrack(track, localStreamRef.current);
					}
				});
			}

			return pc;
		} catch (e) {
			console.error(e);
			return undefined;
		}
	}, []);

  const toggleVideo = () => {
    const videoTrack = localStreamRef.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoEnabled(videoTrack.enabled);
      if (socketRef.current) {
        socketRef.current.emit("toggle_media", {
          userId: socketRef.current.id,
          email: userEmail,
          videoEnabled: videoTrack.enabled,
          audioEnabled: isAudioEnabled,
          audioDisabledByTeacher: isAudioDisabledByTeacher,
          screenShareEnabled: isScreenShareEnabled,
          screenShareDisabledByTeacher: isScreenShareDisabledByTeacher,
        });
      }
      if (!videoTrack.enabled) {
        console.log("Stop DD");
        stopDrowsinessDetection();
      } else {
        console.log("Start DD");
        startDrowsinessDetection();
      }
    }
  };

	const toggleAudio = () => {
		const audioTrack = localStreamRef.current?.getAudioTracks()[0];
		if (audioTrack && !isAudioDisabledByTeacher) {
			audioTrack.enabled = !audioTrack.enabled;
			setIsAudioEnabled(audioTrack.enabled);
			if (socketRef.current) {
				socketRef.current.emit('toggle_media', {
					userId: socketRef.current.id,
					email: userEmail,
					videoEnabled: isVideoEnabled,
					audioEnabled: audioTrack.enabled,
					audioDisabledByTeacher: isAudioDisabledByTeacher,
					screenShareEnabled: isScreenShareEnabled,
					screenShareDisabledByTeacher: isScreenShareDisabledByTeacher
				});
			}
		}
	};

	const offAudio = () => {
		const audioTrack = localStreamRef.current?.getAudioTracks()[0];
		if (audioTrack && !isAudioDisabledByTeacher) {
			audioTrack.enabled = false;
			setIsAudioEnabled(false);
			setIsAudioDisabledByTeacher(true);
			if (socketRef.current) {
				socketRef.current.emit('toggle_student_mic_complete', {
					userId: socketRef.current.id,
					email: userEmail,
					// videoEnabled: true,
					audioEnabled: audioTrack.enabled,
					audioDisabledByTeacher: true
				});
			}
		}
	};

	const allowAudio = () => {
		const audioTrack = localStreamRef.current?.getAudioTracks()[0];
		if (audioTrack && isAudioDisabledByTeacher) {
			audioTrack.enabled = false;
			setIsAudioEnabled(false);
			setIsAudioDisabledByTeacher(false);
			if (socketRef.current) {
				socketRef.current.emit('toggle_student_mic_complete', {
					userId: socketRef.current.id,
					email: userEmail,
					// videoEnabled: true,
					audioEnabled: audioTrack.enabled,
					audioDisabledByTeacher: false
				});
			}
		}
	};


	const allowScreenShare = () => {
		setIsScreenShareEnabled(false);
		setIsScreenShareDisabledByTeacher(false);
		if (socketRef.current) {
			socketRef.current.emit('toggle_student_screen_share_complete', {
				userId: socketRef.current.id,
				// videoEnabled: true,
				userEmail: userEmail,
				screenShareEnabled: false,
				screenShareDisabledByTeacher: false
			});
		}
	};

	const banScreenShare = () => {
		console.log('화면공유 금지됩니다');
		setIsScreenShareEnabled(false);
		setIsScreenShareDisabledByTeacher(true);
		if (socketRef.current) {
			socketRef.current.emit('toggle_student_screen_share_complete', {
				userId: socketRef.current.id,
				// videoEnabled: true,
				userEmail: userEmail,
				screenShareEnabled: false,
				screenShareDisabledByTeacher: true
			});
		}
		setGoScreenShare(false);
	};


	const handleSendMessage = (e:React.FormEvent) => {
		e.preventDefault();
		if (newMessage.trim() !== '') {
			if (socketRef.current) {
				socketRef.current.emit('send_chat', {
					senderRole: userRole,
					senderEmail: userEmail,
					message: newMessage
				});
				setNewMessage('');
			}
		}
	};


	useEffect(() => {
		socketRef.current = io.connect(SOCKET_SERVER_URL);
		getLocalStream();

		socketRef.current.on('all_users', (allUsers: Array<{ id: string; email: string; userRole: string; videoEnabled: boolean; audioEnabled: boolean; audioDisabledByTeacher: boolean; offerSendScreenShareEnabled: boolean; offerSendScreenShareDisabledByTeacher: boolean; }>) => {
			allUsers.forEach(async (user) => {
				if (!localStreamRef.current) return;
				const pc = createPeerConnection(user.id, user.email, user.userRole, user.videoEnabled, user.audioEnabled, user.audioDisabledByTeacher, user.offerSendScreenShareEnabled, user.offerSendScreenShareDisabledByTeacher);
				if (pc && socketRef.current) {
					pcsRef.current = { ...pcsRef.current, [user.id]: pc };
					try {
						const localSdp = await pc.createOffer({
							offerToReceiveAudio: true,
							offerToReceiveVideo: true,
						});
						await pc.setLocalDescription(new RTCSessionDescription(localSdp));
						socketRef.current.emit('offer', {
							sdp: localSdp,
							offerSendID: socketRef.current.id,
							offerSendEmail: userEmail,
							offerSendRole: userRole,
							offerReceiveID: user.id,
						});
					} catch (e) {
						console.error(e);
					}
				}
			});
		});

		socketRef.current.on(
			'getOffer',
			async (data: {
				sdp: RTCSessionDescription;
				offerSendID: string;
				offerSendEmail: string;
				offerSendRole: string;
				offerSendVideoEnabled: boolean;
				offerSendAudioEnabled: boolean;
				offerSendAudioDisabledByTeacher: boolean;
				offerSendScreenShareEnabled: boolean;
				offerSendScreenShareDisabledByTeacher: boolean;
			}) => {
				const { sdp, offerSendID, offerSendEmail, offerSendRole, offerSendVideoEnabled, offerSendAudioEnabled, offerSendAudioDisabledByTeacher, offerSendScreenShareEnabled, offerSendScreenShareDisabledByTeacher} = data;
				if (!localStreamRef.current) return;
				const pc = createPeerConnection(offerSendID, offerSendEmail, offerSendRole, offerSendVideoEnabled, offerSendAudioEnabled, offerSendAudioDisabledByTeacher, offerSendScreenShareEnabled, offerSendScreenShareDisabledByTeacher);
				if (pc && socketRef.current) {
					pcsRef.current = { ...pcsRef.current, [offerSendID]: pc };
					try {
						await pc.setRemoteDescription(new RTCSessionDescription(sdp));
						const localSdp = await pc.createAnswer({
							offerToReceiveVideo: true,
							offerToReceiveAudio: true,
						});
						await pc.setLocalDescription(new RTCSessionDescription(localSdp));
						socketRef.current.emit('answer', {
							sdp: localSdp,
							answerSendID: socketRef.current.id,
							answerReceiveID: offerSendID,
						});
					} catch (e) {
						console.error(e);
					}
				}
			},
		);

		socketRef.current.on(
			'getAnswer',
			(data: { sdp: RTCSessionDescription; answerSendID: string }) => {
				const { sdp, answerSendID } = data;
				console.log('get answer');
				const pc: RTCPeerConnection = pcsRef.current[answerSendID];
				if (pc) {
					pc.setRemoteDescription(new RTCSessionDescription(sdp));
				}
			},
		);

		socketRef.current.on(
			'getCandidate',
			async (data: { candidate: RTCIceCandidateInit; candidateSendID: string }) => {
				console.log('get candidate');
				const pc: RTCPeerConnection = pcsRef.current[data.candidateSendID];
				if (pc) {
					await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
					console.log('candidate add success');
				}
			},
		);

		socketRef.current.on('user_exit', (data: { id: string }) => {
			if (pcsRef.current[data.id]) {
				pcsRef.current[data.id].close();
				delete pcsRef.current[data.id];
				setUsers((oldUsers) => oldUsers.filter((user) => user.id !== data.id));
			}
		});

		socketRef.current.on('update_media', (data: { userId: string; videoEnabled: boolean; audioEnabled: boolean; audioDisabledByTeacher: boolean, screenShareEnabled: boolean, screenShareDisabledByTeacher: boolean }) => {
			setUsers((oldUsers) =>
				oldUsers.map((user) =>
					user.id === data.userId
						? { ...user, videoEnabled: data.videoEnabled, audioEnabled: data.audioEnabled, audioDisabledByTeacher: data.audioDisabledByTeacher, screenShareEnabled: data.screenShareEnabled, screenShareDisabledByTeacher: data.screenShareDisabledByTeacher}
						: user,
				),
			);
		});

		socketRef.current.on('toggle_student_mic', (data: { userId: string; audioDisabledByTeacher: boolean }) => {

			if(data.audioDisabledByTeacher){
				if (data.userId === socketRef.current?.id) {
					setIsAudioDisabledByTeacher(data.audioDisabledByTeacher);
					setIsAudioEnabled(false);
				}
				offAudio();
			}else{
				if (data.userId === socketRef.current?.id) {
					setIsAudioDisabledByTeacher(data.audioDisabledByTeacher);
					setIsAudioEnabled(false);
				}
				allowAudio();
			}

			setUsers((oldUsers) =>
				oldUsers.map((user) =>
					user.id === data.userId
						? { ...user, audioDisabledByTeacher: data.audioDisabledByTeacher }
						: user,
				),
			);
		});

		socketRef.current.on('receive_chat', (data: { senderRole: string; senderEmail: string; receivedChat: string }) => {
			setMessages((oldMessages) => [...oldMessages, `[${data.senderEmail}] ${data.receivedChat}`]);
		});

		socketRef.current.on('toggle_student_screen_share', (data: { userId: string; userEmail: string; screenShareDisabledByTeacher: boolean }) => {
			console.log(`Teacher toggled student's screen share ${data.userId}: screenShareDisabledByTeacher=${data.screenShareDisabledByTeacher}`);
				if(data.screenShareDisabledByTeacher){
					if (data.userId === socketRef.current?.id) {
						setIsScreenShareDisabledByTeacher(data.screenShareDisabledByTeacher);
						setIsScreenShareEnabled(false);
					}
					banScreenShare();
				}else{
					if (data.userId === socketRef.current?.id) {
						setIsScreenShareDisabledByTeacher(data.screenShareDisabledByTeacher);
						setIsScreenShareEnabled(false);
					}
					allowScreenShare();
				}

          setUsers((oldUsers) =>
            oldUsers.map((user) =>
              user.id === data.userId
                ? {
                    ...user,
                    screenShareDisabledByTeacher:
                      data.screenShareDisabledByTeacher,
                  }
                : user
            )
          );
      }
    );

    socketRef.current.on("quiz_start", (data: { quizId: string }) => {
      //퀴즈모달 켜기
      openQuiz(data.quizId);
    });



		socketRef.current.on('lecture_end', () => {


			if (socketRef.current) {
				socketRef.current.disconnect();
			}
			users.forEach((user) => {
				if (pcsRef.current[user.id]) {
					pcsRef.current[user.id].close();
					delete pcsRef.current[user.id];
				}
      });
      closeLecture();

		});

		return () => {
			if (socketRef.current) {
				socketRef.current.disconnect();
			}
			users.forEach((user) => {
				if (pcsRef.current[user.id]) {
					pcsRef.current[user.id].close();
					delete pcsRef.current[user.id];
				}
			});
		};
	}, [createPeerConnection, getLocalStream]);

  const toggleFullscreen = () => {
    if (localVideoRef.current) {
      if (!document.fullscreenElement) {
        localVideoRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };


  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  const handleTimeUpdate = () => {
    if (localVideoRef.current) {
      setCurrentTime(localVideoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (localVideoRef.current) {
      setDuration(localVideoRef.current.duration);
    }
  };

  const handleFullscreenChange = () => {
    setShowControls(true);
    showControlsTemporarily();
    if (!document.fullscreenElement) {
      setShowControls(false);
    }
  };

  const handleMouseEnter = () => {
    setShowControls(true);
    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current);
    }
  };

  const handleMouseMove = () => {
    showControlsTemporarily();
  };

  const handleMouseLeave = () => {
    setShowControls(false);
    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current);
    }
  };

  document.body.onmousemove = handleMouseMove;

  const showControlsTemporarily = () => {
    setShowControls(true);
    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current);
    }
    hideControlsTimeout.current = setTimeout(() => {
      setShowControls(false);
    }, 2000);
  };

  useEffect(() => {
    if (localVideoRef.current) {
      localVideoRef.current.addEventListener("timeupdate", handleTimeUpdate);
      localVideoRef.current.addEventListener(
        "loadedmetadata",
        handleLoadedMetadata
      );
      document.addEventListener("fullscreenchange", handleFullscreenChange);
      return () => {
        localVideoRef.current?.removeEventListener(
          "timeupdate",
          handleTimeUpdate
        );
        localVideoRef.current?.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
        document.removeEventListener(
          "fullscreenchange",
          handleFullscreenChange
        );
      };
    }
  }, []);

	return (
		<div
			className={`${styles.videoContainer} ${
				isFullscreen
					? "flex flex-wrap items-center justify-center w-full h-screen bg-discordChatBg top-0 left-0 z-50 gap-4"
					: "flex flex-wrap items-center justify-center w-full h-screen bg-discordChatBg gap-4"
			}`}
			// onMouseEnter={handleMouseEnter}
			// onMouseMove={handleMouseMove}
			// onMouseLeave={handleMouseLeave}
		>
			<div
				className={`${
					isFullscreen
						? "fixed top-0 left-0 w-full h-full z-50 bg-black grid grid-cols-12 gap-4"
						: "grid grid-cols-12 gap-4 w-full"
				} ${
					isChatOpen
						? "mr-[300px] transition-margin-right duration-500 ease-in-out"
						: "mr-0 transition-all duration-500 ease-in-out"
				} flex flex-wrap items-center justify-center bg-discordChatBg`}
			>
				<div className="col-span-6 flex items-center justify-center">
					<div style={{ display: "inline-block" }}>
						<div
							ref={divRef}
							style={{position: "relative", width: 600, height: 338}}
							className={`${styles.videoContainer}`}
						>
							<p className="font-bold text-white">{userEmail} 학생</p>
							<video
								className="w-full h-auto bg-black rounded-2xl"
								onClick={toggleFullscreen}
								muted={isMuted}
								ref={localVideoRef}
								autoPlay
								controls={false}
							/>
						</div>
						{showControls && (
							<div
								className={`fixed bottom-0 left-0 right-0 flex justify-around items-center p-3 rounded-lg ${showControls ? 'translate-y-0 opacity-100 transition-transform transition-opacity duration-500 ease-in-out' : 'translate-y-full opacity-0 transition-transform transition-opacity duration-500 ease-in-out'} bg-opacity-5 bg-gradient-to-t from-[#111111] to-transparent z-10`}>
								<div className='grid grid-cols-12 ' style={{marginBottom: '10px', marginTop: '12px'}}>
									<div className='col-span-2'></div>
									<div className='col-span-8 flex items-center justify-center'>

										<button onClick={toggleVideo}
												className="flex items-center justify-center text-white rounded-full border-0 border-white w-14 h-14 mx-3 bg-[#262626]">
											{isVideoEnabled ? <img src={`${cam}`} className="w-8 h-8"/> :
												<img src={`${nocam}`} className="w-8 h-8"/>}
										</button>
										<button onClick={toggleAudio}
												className="flex items-center justify-center text-white rounded-full border-0 border-white w-14 h-14 mx-3 bg-[#262626]">
											{isAudioEnabled ? <img src={`${mic}`} className="w-8 h-8"/> :
												<img src={`${nomic}`} className="w-8 h-8"/>}
										</button>
										<button onClick={toggleScreenShare}
												className="flex items-center justify-center text-white rounded-full border-0 border-white w-14 h-14 mx-3 bg-[#262626]">
											{isScreenShareEnabled ? <img src={`${screenShare}`} className="w-8 h-8"/> :
												<img src={`${noScreenShare}`} className="w-8 h-8"/>}
										</button>
										<button
											onClick={toggleChat}
											className="flex items-center justify-center text-white rounded-full border-0 border-white w-14 h-14 mx-3 bg-[#262626]"
										>
											{isChatOpen ? <img src={`${chat}`} className="w-8 h-8"/> :
												<img src={`${noChat}`} className="w-8 h-8"/>}
										</button>
										<button
											onClick={function () {
												history.back();
											}}
											className="flex items-center justify-center text-white rounded-full border-0 border-white w-14 h-14 mx-3 bg-red-500"
										>
											<img src={`${lecture_close}`} className="w-8 h-8"/>
										</button>
									</div>
									<div className='col-span-2'></div>
								</div>
							</div>
						)}
					</div>
				</div>
				<div className="col-span-6 flex items-center justify-center">
					<div style={{display: "inline-block"}}>
						{goScreenShare && (
							<WebrtcStudentScreenShare
								roomId={roomId}
								userEmail={userEmail + "_screen"}
								userRole={userRole + "_screen"}
								toggleScreenShareFunc={toggleScreenShareFunc}
								screenShareStopSignal={screenShareStopSignal}
							/>
						)}
					</div>
				</div>
			</div>

			<div
				className={`grid grid-cols-12 gap-4 w-full mt-4 mb-10 ${
					isChatOpen ? "mr-[320px]" : "mr-0"
				} transition-all duration-500 ease-in-out`}
			>
				{users.map((user, index) => (
					<div
						key={user.id}
						className="col-span-6 flex items-center justify-center pb-4"
					>
						<WebRTCVideo
							email={user.email}
							userRole={user.userRole}
							stream={user.stream}
							videoEnabled={user.videoEnabled}
							audioEnabled={user.audioEnabled}
							audioDisabledByTeacher={user.audioDisabledByTeacher}
							screenShareEnabled={user.screenShareEnabled}
							screenShareDisabledByTeacher={user.screenShareDisabledByTeacher}
							muted={
								userRole.toUpperCase() !== "teacher".toUpperCase() &&
								user.userRole.toUpperCase() !== "teacher".toUpperCase()
							}
						/>
					</div>
				))}
			</div>

			{isQuizModalOpen && selectedQuiz && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
					<div className="bg-white rounded-lg shadow-lg w-[500px] relative">
						{/* Close Button Overlapping DetailQuiz */}
						<button
							onClick={handleCloseQuizModal}
							className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition text-2xl z-10"
						>
							&times;
						</button>

						{/* DetailQuiz Component Centered */}
						<div className="flex justify-center items-center">
							<div className="rounded-lg overflow-hidden w-full">
								{/* 학생인 경우에는 trialVersion, isTeacher false */}
								<DetailQuiz
									initialQuizData={selectedQuiz}
									onClose={handleCloseQuizModal}
                  trialVersion={false}
                  isTeacher={false}
                />
              </div>
            </div>
          </div>
        </div>
      )}

			<div
				className={`absolute border-l-2 border-discordChatBg2 top-0 right-0 h-full w-80 p-4 bg-discordChatBg2 text-discordText ${
					isChatOpen
						? "translate-x-0 transition-transform duration-500 ease-in-out"
						: "translate-x-full transition-transform duration-500 ease-in-out"
				}`}
			>
				<h3 className="my-2 text-2xl font-semibold">채팅</h3>
				<div
					className="border border-discordChatBg2 p-2 h-[45rem] overflow-y-auto bg-discordChatBg text-discordText">
					{messages.map((msg, idx) => (
						<p key={idx}>{msg}</p>
					))}
				</div>
				<form onSubmit={handleSendMessage}>
					<input
						type="text"
						value={newMessage}
						onChange={(e) => setNewMessage(e.target.value)}
						placeholder="메세지 전송"
						className="border-2 my-2 border-discordChatBg2 p-2 w-full bg-discordChatBg text-discordText"
					/>
					<button
						type="submit"
						className="mb-2 p-2 bg-discordChatBg text-discordText rounded w-full border-2 border-discordChatBg2"
					>
						전송
					</button>
				</form>
			</div>
		</div>
	);
};

export default WebrtcStudent;
