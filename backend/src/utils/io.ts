import { io } from "../main.ts";

export const addUserToRoom = async (googleId: string, roomId: string) => {
	const sockets = await io.in(googleId).fetchSockets();
	const socket = sockets[0];
	socket.join(roomId);
}


export const removeUserFromRoom = async (googleId: string, roomId: string) => {
	const sockets = await io.in(googleId).fetchSockets();
	const socket = sockets[0];
	socket.leave(roomId);
}
