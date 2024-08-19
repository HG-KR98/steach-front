import { useEffect, useRef } from 'react';
import styled from 'styled-components';

const Container = styled.div`
	position: relative;
	display: inline-block;
	width: 600px;
	height: 338px;
	margin: 5px;

		@media (max-width: 768px) {
		width: 200px;
		height: 113px;
	}
`;

const VideoContainer = styled.video`
  width: 600px;
  height: 338px;
  background-color: black;
  border-radius: 16px;

		@media (max-width: 768px) {
		width: 200px;
		height: 113px;
	}
`;

const ScreenContainer = styled.div`
	position: relative;
	display: inline-block;
	width: 200px;
	height: 113px;
	margin: 5px;
`;

const ScreenVideoContainer = styled.video`
  width: 200px;
  height: 113px;
  background-color: black;
  border-radius: 16px;
`;

const UserLabel = styled.p`
	//position: absolute;
	top: 240px;
	left: 0;
	width: 100%;
	text-align: left;
	margin: 0;
	padding: 2px;
`;

const UserRoleLabel = styled.p`
	top: 255px;
	left: 0;
	width: 100%;
	text-align: left;
	margin: 0;
	padding: 2px;
`;

const Indicator = styled.p`
	//position: absolute;
	top: 270px;
	left: 0;
	width: 100%;
	text-align: left;
	margin: 0;
	padding: 2px;
`;

interface Props {
	email: string;
	userRole: string;
	stream: MediaStream;
	videoEnabled: boolean;
	audioEnabled: boolean;
	audioDisabledByTeacher?: boolean;
	screenShareEnabled: boolean;
	screenShareDisabledByTeacher?: boolean;
	muted?: boolean;
	isScreenShare?: boolean;
}

const WebRTCVideo = ({ email, userRole, stream, videoEnabled, audioEnabled, audioDisabledByTeacher, screenShareEnabled, screenShareDisabledByTeacher, muted, isScreenShare}: Props) => {
	const ref = useRef<HTMLVideoElement>(null);

	const toggleFullscreen = () => {
    if (ref.current) {
      if (!document.fullscreenElement) {
        ref.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
	};


	useEffect(() => {
		if (ref.current) ref.current.srcObject = stream;
	}, [stream]);

	if(isScreenShare){
		return (
			<ScreenContainer>
				<p> {email.substring(0, email.length-7)} {userRole.toUpperCase().includes('student'.toUpperCase()) ? '학생' : '선생님'}의 화면공유</p>
				<ScreenVideoContainer ref={ref} muted={muted} autoPlay onClick={toggleFullscreen} />
				{/* <UserLabel>{email}</UserLabel> */}
			</ScreenContainer>
		);
	}else{
		if(userRole.endsWith('_screen')){
			return (
				<Container>
					<UserLabel className='text-white'>{email.substring(0, email.length-7)} {userRole.toUpperCase() === 'student'.toUpperCase() ? '학생' : '선생님'}의 화면공유</UserLabel>
					<VideoContainer ref={ref} muted={muted} autoPlay onClick={toggleFullscreen}/>
				</Container>
			);
		}else {
			return (
				<Container>
					<UserLabel
						className='text-white'>{email} {userRole.toUpperCase() === 'student'.toUpperCase() ? '학생' : '선생님'}</UserLabel>
					<VideoContainer ref={ref} muted={muted} autoPlay onClick={toggleFullscreen}/>
				</Container>
			);
		}
	}
};

export default WebRTCVideo;
