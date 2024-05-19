import { Request, Response, Router } from "express";
import { authMW } from "../middleware/auth.ts";
import { MessageModel, RoomModel, UserModel } from "../models/exports.ts";

const messageCreate = async (req: Request, res: Response) => {
	try {
		const usersub = res.locals.usersub;
		const roomId = req.params.roomId;
		const content = JSON.parse(req.body)?.content;
		const user = await UserModel.findOne({ googleId: usersub });
		const message = await MessageModel.create({ sender: user?.id, content: content });
		const room = await RoomModel.findByIdAndUpdate(roomId, { $push: { messages: message.id } });
		res.send({
			message: {
				id: message?.id,
				sender: message?.sender,
				content: message?.content,
				createTime: message?.createTime,
				editTime: message?.editTime,
				read: message?.read
			}
		});
	} catch (err) {
		res.statusCode = 500;
		res.send();
	}
}

const messageEdit = async (req: Request, res: Response) => {
	try {
		const messageId = req.params.messageId;
		const content = JSON.parse(req.body)?.content;
		const message = await MessageModel.findByIdAndUpdate(messageId, { content: content, editTime: Date.now() });
		res.send({
			message: {
				id: message?.id,
				sender: message?.sender,
				content: message?.content,
				createTime: message?.createTime,
				editTime: message?.editTime,
				read: message?.read
			}
		});
	} catch (err) {
		res.statusCode = 500;
		res.send();
	}
}

const messageDelete = async (req: Request, res: Response) => {
	try {
		const messageId = req.params.messageId;
		const room = await RoomModel.findOneAndUpdate({ messages: messageId });
		const message = await MessageModel.findByIdAndDelete(messageId);
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
messageRouter.get("/delete/:messageId", messageDelete);
