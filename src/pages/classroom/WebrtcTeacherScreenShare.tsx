import React, { useState, useRef, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import { WebRTCUser } from '../../types';

const pc_config = {
	iceServers: [
		{
			urls: 'stun:stun.l.google.com:19302',
		},
	],
};

const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const SOCKET_SERVER_URL = `${protocol}//${window.location.hostname}:${window.location.port ? window.location.port : '5000'}`;


interface WebrtcProps {
	roomId: string;
	userEmail: string;
	userRole: string;
	toggleScreenShareFunc : () =>  void;
	screenShareStopSignal: boolean;
}

const WebrtcTeacherScreenShare: React.FC<WebrtcProps> = ({ roomId, userEmail, userRole, toggleScreenShareFunc, screenShareStopSignal }) => {
	const socketRef = useRef<SocketIOClient.Socket>();
	const pcsRef = useRef<{ [socketId: string]: RTCPeerConnection }>({});
	const localScreenShareRef = useRef<HTMLVideoElement>(null);
	const localScreenShareStreamRef = useRef<MediaStream>();
	const [users, setUsers] = useState<WebRTCUser[]>([]);

	useEffect(() => {
		if(screenShareStopSignal){
			const videoTrack = localScreenShareStreamRef.current?.getVideoTracks()[0];
			if(videoTrack){
				videoTrack.stop();
				videoTrack.enabled = false;
			}
			toggleScreenShareFunc();
		}
	}, [screenShareStopSignal]);

	const toggleFullscreen = () => {
    if (localScreenShareRef.current) {
      if (!document.fullscreenElement) {
        localScreenShareRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
	};

	const getLocalStream = useCallback(async () => {
		try {
			const localScreenShareStream = await navigator.mediaDevices.getDisplayMedia({
				video: {
					width: 1920,
					height: 1080,
					cursor: 'always'
				} as MediaTrackConstraints,
				audio: false
			});

			localScreenShareStreamRef.current = localScreenShareStream;

			if (localScreenShareRef.current) localScreenShareRef.current.srcObject = localScreenShareStream;
			if (!socketRef.current) return;

			const videoTrack = localScreenShareStreamRef.current?.getVideoTracks()[0];

			videoTrack.addEventListener('ended', () => {
				toggleScreenShareFunc();
			});

			localScreenShareStreamRef.current?.addTrack(videoTrack);

			socketRef.current.emit('join_room', {
				room: roomId,
				email: userEmail,
				userRole: userRole,
				videoEnabled: true,
				audioEnabled: true,
				audioDisabledByTeacher: false,
				screenShareEnabled: true,
				screenShareDisabledByTeacher: false
			});

		} catch (err) {
			toggleScreenShareFunc();
		}
	}, [roomId, userEmail, userRole]);

	const createPeerConnection = useCallback((socketID: string, email: string, role: string, videoEnabled: boolean, audioEnabled: boolean, audioDisabledByTeacher: boolean, screenShareEnabled: boolean, screenShareDisabledByTeacher: boolean) => {
		try {
			const pc = new RTCPeerConnection(pc_config);

			pc.onicecandidate = (e) => {
				if (socketRef.current && e.candidate) {
					socketRef.current.emit('candidate', {
						candidate: e.candidate,
						candidateSendID: socketRef.current.id,
						candidateReceiveID: socketID,
					});
				}
			};
			pc.ontrack = (e) => {
				setUsers((oldUsers) =>
					oldUsers
						// .filter((user) => user.id !== socketID)
						.filter((user) => user.email !== email)
						.concat({
							id: socketID,
							email: email,
							userRole: role,
							stream: e.streams[0],
							screenShareStream: e.streams[0],
							videoEnabled: videoEnabled,
							audioEnabled: audioEnabled,
							audioDisabledByTeacher: audioDisabledByTeacher,
							screenShareEnabled: screenShareEnabled,
							screenShareDisabledByTeacher: screenShareDisabledByTeacher
						}),
				);

			};

			if (localScreenShareStreamRef.current) {
				localScreenShareStreamRef.current.getTracks().forEach((track) => {
					if (localScreenShareStreamRef.current) {
						pc.addTrack(track, localScreenShareStreamRef.current);
					}
				});
			}
			return pc;
		} catch (e) {
			console.error(e);
			return undefined;
		}
	}, []);

	useEffect(() => {
		socketRef.current = io.connect(SOCKET_SERVER_URL);
		getLocalStream();

		socketRef.current.on('all_users', (allUsers: Array<{ id: string; email: string; userRole: string; videoEnabled: boolean; audioEnabled: boolean; audioDisabledByTeacher: boolean; offerSendScreenShareEnabled: boolean; offerSendScreenShareDisabledByTeacher: boolean; }>) => {
			allUsers.forEach(async (user) => {
				if (!localScreenShareStreamRef.current) return;
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
				if (!localScreenShareStreamRef.current) return;
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
				const pc: RTCPeerConnection = pcsRef.current[answerSendID];
				if (pc) {
					pc.setRemoteDescription(new RTCSessionDescription(sdp));
				}
			},
		);

		socketRef.current.on(
			'getCandidate',
			async (data: { candidate: RTCIceCandidateInit; candidateSendID: string }) => {
				const pc: RTCPeerConnection = pcsRef.current[data.candidateSendID];
				if (pc) {
					await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
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

		socketRef.current.on('update_allow_mic', (data: { userId: string; audioEnabled: boolean; audioDisabledByTeacher: boolean }) => {
			setUsers((oldUsers) =>
				oldUsers.map((user) =>
					user.id === data.userId
						? { ...user, audioEnabled: data.audioEnabled, audioDisabledByTeacher: data.audioDisabledByTeacher }
						: user,
				),
			);
		});

		socketRef.current.on('toggle_student_mic', (data: { userId: string; audioDisabledByTeacher: boolean }) => {

			setUsers((oldUsers) =>
				oldUsers.map((user) =>
					user.id === data.userId
						? { ...user, audioDisabledByTeacher: data.audioDisabledByTeacher }
						: user,
				),
			);
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

	return (
		<div>
			<video
				onClick={toggleFullscreen}
				style={{
					width: 600,
					height: 338,
					margin: 5,
					backgroundColor: '#374151',
				}}
				muted
				ref={localScreenShareRef}
				autoPlay
			/>
		</div>
	);
};

export default WebrtcTeacherScreenShare;
