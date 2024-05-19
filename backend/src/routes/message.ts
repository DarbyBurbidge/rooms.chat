import { Request, Response, Router } from "express";
import { authMW } from "../middleware/auth.ts";
import { MessageModel, RoomModel, UserModel } from "../models/exports.ts";

const messageCreate = async (req: Request, res: Response) => {
	try {
		const usersub = res.locals.usersub;
		const roomId = req.params.roomId;
		const content = req.body?.content;
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
		const usersub = res.locals.usersub;
		const messageId = req.params.messageId;
		const content = req.body?.content;
		console.log(content)
		const user = await UserModel.findOne({ googleId: usersub });
		console.log(user?.id)
		const message = await MessageModel.findOneAndUpdate({ _id: messageId, sender: user?.id }, { content: content, editTime: Date.now() }, { new: true });
		console.log(message)
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
		const usersub = res.locals.usersub;
		const messageId = req.params.messageId;
		const user = await UserModel.findOne({ googleId: usersub });
		const message = await MessageModel.findOneAndDelete({ _id: messageId, sender: user?.id });
		if (message) {
			const room = await RoomModel.findOneAndUpdate({ messages: messageId });
		}
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
