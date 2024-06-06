import { Request, Response, Router } from "express";
import { authMW } from "../middleware/auth.ts";
import { randomUUID } from "crypto";
import { addUserToRoom, removeUserFromRoom } from "../utils/io.ts";
import { resolveRoomCreate, resolveRoomDelete, resolveRoomInfo, resolveRoomJoin, resolveRoomLeave, resolveRoomLink, resolveRoomLinkInfo, resolveRoomList } from "../resolvers/room.ts";

export const roomCreate = async (req: Request, res: Response) => {
	try {
		const base = encodeURI(randomUUID());
		const roomName = req.body.name;
		const url = base;
		const usersub = res.locals.usersub;
		const roomId = await resolveRoomCreate(usersub, roomName, url);
		await addUserToRoom(usersub, roomId);
		res.send({
			"room": {
				roomCode: roomId
			}
		});
	}
	catch (err) {
		console.error(err);
		res.send();
	}
};

export const roomDelete = async (req: Request, res: Response) => {
	try {
		const roomId = req.params.roomId;
		await resolveRoomDelete(roomId);
		res.send();
	} catch (err) {
		console.error(err);
		res.statusCode = 500;
		res.statusMessage = "Server Error";
		res.send();
	}
};

export const roomLink = async (req: Request, res: Response) => {
	try {
		const roomId = req.params.roomId;
		const inviteUrl = await resolveRoomLink(roomId);
		res.send({
			"inviteUrl": inviteUrl
		});
	} catch (err) {
		console.error(err);
		res.statusCode = 500;
		res.statusMessage = "Server Error";
		res.send();
	}
};

export const roomJoin = async (req: Request, res: Response) => {
	try {
		const inviteUrl = req.params.inviteUrl;
		const usersub = res.locals.usersub;
		const roomId = await resolveRoomJoin(inviteUrl, usersub);
		await addUserToRoom(usersub, roomId);
		res.send();
	} catch (err) {
		console.error(err);
		res.statusCode = 500;
		res.send();
	}
}

export const roomLeave = async (req: Request, res: Response) => {
	try {
		const roomId = req.params.roomId;
		const socketId = req.params.socketId;
		const usersub = res.locals.usersub;
		const room = await resolveRoomLeave(roomId, usersub);
		await removeUserFromRoom(usersub, room?.id);
		res.send({
			"room": {
				id: room?.id,
				creator: room?.creator,
				admins: room?.admins,
				users: room?.users,
				messages: room?.messages
			}
		});
	} catch (err) {
		console.error(err);
		res.statusCode = 500;
		res.send();
	}
};

export const roomList = async (_: Request, res: Response) => {
	try {
		const usersub = res.locals.usersub;
		const rooms = await resolveRoomList(usersub);
		res.json({ "rooms": rooms }).send();
	} catch (err) {
		console.error(err);
		res.statusCode = 500;
		res.statusMessage = "Server Error";
		res.send();
	}
};

export const roomInfo = async (req: Request, res: Response) => {
	try {
		const roomId = req.params.roomId;
		const room = await resolveRoomInfo(roomId);
		res.send({
			"room": {
				id: room?.id,
				name: room?.name,
				creator: room?.creator,
				admins: room?.admins,
				users: room?.users,
				messages: room?.messages,
				inviteUrl: room?.inviteUrl
			}
		});
	} catch (err) {
		console.error(err);
		res.statusCode = 500;
		res.statusMessage = "Server Error";
		res.send();
	}
};
export const roomLinkInfo = async (req: Request, res: Response) => {
	try {
		const inviteUrl = req.params.roomId;
		console.log(inviteUrl)
		const room = await resolveRoomLinkInfo(inviteUrl);
		res.send({
			"room": {
				id: room?.id,
				name: room?.name,
				creator: room?.creator,
				admins: room?.admins,
				users: room?.users,
				messages: room?.messages
			}
		});
	} catch (err) {
		console.error(err);
		res.statusCode = 500;
		res.statusMessage = "Server Error";
		res.send();
	}
};

export const roomRouter = Router();
roomRouter.use(authMW);

roomRouter.post("/create/", roomCreate);
roomRouter.delete("/delete/:roomId", roomDelete);
roomRouter.get("/link/:roomId", roomLink);
roomRouter.put("/join/:inviteUrl", roomJoin);
roomRouter.put("/leave/:roomId", roomLeave);
roomRouter.get("/list", roomList);
roomRouter.get("/info/:roomId", roomInfo);
roomRouter.get("/linkinfo/:roomId", roomLinkInfo);
