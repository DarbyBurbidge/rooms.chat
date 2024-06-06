import { Request, Response, Router } from "express";
import { io } from "../main.ts";
import { authMW } from "../middleware/auth.ts";
import { MessageModel, NotificationModel, RoomModel, UserModel } from "../models/exports.ts";
import { User } from "src/models/user.ts";
import { Room } from "src/models/room.ts";
import { DocumentType } from "@typegoose/typegoose";
import { resolveMessageCreate, resolveMessageDelete, resolveMessageEdit } from "../resolvers/message.ts";

const sendNewMessageNotification = async (sender: DocumentType<User>, room: DocumentType<Room>, userId: string) => {
	try {
		const notification = await NotificationModel.create({ from: sender, message: `${sender?.given_name} ${sender?.family_name} has sent a message in ${room?.name}`, type: "new message", url: `http://localhost:5173/tester/${room?.id}` })
		const user = await UserModel.findByIdAndUpdate(userId, { $push: { notifications: notification } });
		io.to(user!.googleId).emit("new message", notification);
	} catch (err) {
		throw Error("Failed to spawn notification");
	}

}


const messageCreate = async (req: Request, res: Response) => {
	try {
		const usersub = res.locals.usersub;
		const roomId = req.params.roomId;
		const content = req.body?.content;
		const { sender, message, room } = await resolveMessageCreate(usersub, roomId, content);
		room?.users.forEach(async (user) => {
			await sendNewMessageNotification(sender!, room!, user.id);
		});
		room?.admins.forEach(async (admin) => {
			await sendNewMessageNotification(sender!, room!, admin.id);
		});
		await sendNewMessageNotification(sender!, room!, room?.creator.id)
		res.send({
			message: {
				id: message?.id,
				sender: message?.sender,
				content: message?.content,
				createTime: message?.createTime,
				editTime: message?.editTime,
			}
		});
	} catch (err) {
		res.statusCode = 500;
		res.send();
	}
}

const messageEdit = async (req: Request, res: Response) => {
	try {
		const usersub = res.locals.usersub;
		const messageId = req.params.messageId;
		const content = req.body?.content;
		const message = await resolveMessageEdit(usersub, messageId, content);
		res.send({
			message: {
				id: message?.id,
				sender: message?.sender,
				content: message?.content,
				createTime: message?.createTime,
				editTime: message?.editTime,
			}
		});
	} catch (err) {
		res.statusCode = 500;
		res.send();
	}
}

const messageDelete = async (req: Request, res: Response) => {
	try {
		const usersub = res.locals.usersub;
		const messageId = req.params.messageId;
		await resolveMessageDelete(usersub, messageId);
		res.send();
	} catch (err) {
		res.statusCode = 500;
		res.send();
	}
}

export const messageRouter = Router();
messageRouter.use(authMW);

messageRouter.post("/create/:roomId", messageCreate);
messageRouter.put("/edit/:messageId", messageEdit);
messageRouter.delete("/delete/:messageId", messageDelete);
