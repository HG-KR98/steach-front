export type WebRTCUser = {
	id: string;
	email: string;
	userRole: string;
	stream: MediaStream;
	screenShareStream?: MediaStream | undefined;
	videoEnabled: boolean;
	audioEnabled: boolean;
	audioDisabledByTeacher: boolean;
	screenShareEnabled: boolean;
	screenShareDisabledByTeacher: boolean;
};
