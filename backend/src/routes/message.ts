import { Request, Response, Router } from "express";
import { mongoose, DocumentType } from "@typegoose/typegoose";
import { io } from "../main.js";
import { authMW } from "../middleware/auth.js";
import { NotificationModel, UserModel } from "../models/exports.js";
import { User } from "src/models/user.js";
import { Room } from "src/models/room.js";
import { resolveMessageCreate, resolveMessageDelete, resolveMessageEdit } from "../resolvers/message.js";

const sendNewMessageNotification = async (sender: DocumentType<User>, room: DocumentType<Room>, userId: mongoose.Types.ObjectId) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const message = `${sender?.given_name} ${sender?.family_name} has sent a message in ${room?.name}`;
		const type = "new message";
		const url = `http://localhost:5173/tester/${room?._id}`;
		console.log("stopped here")
		const notifications = await NotificationModel.create([{
			message,
			type,
			url,
			from: sender,
		}]);
		console.log(userId)
		const user = await UserModel.findByIdAndUpdate(userId, { $push: { notifications: notifications[0] } }, { new: true });
		await session.commitTransaction();
		console.log("got user");
		io.to(user!.googleId).emit("new message", notifications[0]);
		return;
	} catch (err) {
		await session.abortTransaction();
		console.error(err)
		throw new Error("Failed to spawn notification");
	} finally {
		session.endSession();
	}
}


const messageCreate = async (req: Request, res: Response) => {
	try {
		const usersub = res.locals.usersub;
		const roomId = req.params.roomId;
		const content = req.body?.content;
		const { sender, message, room } = await resolveMessageCreate(usersub, roomId, content);
		console.log(sender, message, room)
		room?.users.forEach(async (user) => {
			await sendNewMessageNotification(sender!, room!, user._id);
		});
		console.log("users notified");
		room?.admins.forEach(async (admin) => {
			await sendNewMessageNotification(sender!, room!, admin._id);
		});
		console.log("admins notified");
		await sendNewMessageNotification(sender!, room!, room?.creator._id!)
		if (room && message) {
			io.to(room.id).emit("message", message);
		} else {
			res.statusCode = 500;
			res.send()
		}
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
		console.error(err);
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
		console.log(err);
		res.statusCode = 500;
		res.send();
	}
}

export const messageRouter = Router();
messageRouter.use(authMW);

messageRouter.post("/create/:roomId", messageCreate);
messageRouter.put("/edit/:messageId", messageEdit);
messageRouter.delete("/delete/:messageId", messageDelete);
