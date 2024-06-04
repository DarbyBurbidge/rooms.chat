import { Request, Response, Router } from "express";
import { authMW } from "../middleware/auth.ts";
import { RoomModel, UserModel } from "../models/exports.ts";
import { randomUUID } from "crypto";
import { Socket } from "socket.io";
import { io } from "../main.ts";
import { resolveRoomCreate, resolveRoomDelete } from "../resolvers/room.ts";

export const roomCreate = async (req: Request, res: Response) => {
	try {
		const base = encodeURI(randomUUID());
		const roomName = req.body.name;
		const url = base;
		const usersub = res.locals.usersub;
		const roomId = await resolveRoomCreate(usersub, roomName, url);
		const sockets = await io.in(usersub).fetchSockets();
		const socket = sockets[0];
		socket.join(
			roomId)
		console.log(socket.rooms)
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
		const room = await RoomModel.findById(roomId);
		res.send({
			"inviteUrl": room?.inviteUrl
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
		const socketId = req.params.socketId;
		const inviteUrl = req.params.inviteUrl;
		const usersub = res.locals.usersub;
		//const socket = req.app.get("io").socket.sockets.get(socketId);
		const preRoom = await RoomModel.findOne({ inviteUrl: inviteUrl });
		const user = await UserModel.findOneAndUpdate({ googleId: usersub }, { $push: { rooms: preRoom?.id } });
		const room = await RoomModel.findOneAndUpdate({ inviteUrl: inviteUrl }, { $push: { users: user } });
		console.log("NO ERROR")
		//socket.join(room?.id);
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
		const socket: Socket = req.app.get("io").sockets.sockets.get(socketId);
		const user = await UserModel.findOneAndUpdate({ googleId: usersub }, { $pull: { rooms: roomId } });
		let room = await RoomModel.findById(roomId);
		if (user?.id == room?.creator.id) {
			res.redirect(`http://localhost:3000/room/delete/${socketId}/${roomId}`);
		} else if (room?.admins.includes(user?.id)) {
			room = await RoomModel.findByIdAndUpdate(roomId, { $pull: { users: user?.id } });
		} else {
			room = await RoomModel.findByIdAndUpdate(roomId, { $pull: { users: user?.id } });
		}
		socket.leave(roomId);
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
		const user = await UserModel.findOne({ googleId: usersub }).populate('rooms');
		res.json({ "rooms": user?.rooms }).send();
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
		const room = await RoomModel.findOne({ _id: roomId }).populate('creator').populate('admins').populate('users').populate('messages');
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
		const room = await RoomModel.findOne({ inviteUrl: inviteUrl }).populate('creator').populate('admins').populate('users').populate('messages');
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
roomRouter.put("/join/:socketId/:inviteUrl", roomJoin);
roomRouter.put("/leave/:socketId/:roomId", roomLeave);
roomRouter.get("/list", roomList);
roomRouter.get("/info/:roomId", roomInfo);
roomRouter.get("/linkinfo/:roomId", roomLinkInfo);
