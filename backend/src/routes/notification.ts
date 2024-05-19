import { Request, Response, Router } from "express";
import { authMW } from "../middleware/auth.ts";
import { NotificationModel, UserModel } from "src/models/exports.ts";

const notificationRead = async (req: Request, res: Response) => {
	try {
		const usersub = res.locals.usersub;
		const noteId = req.params.noteId;
		const user = await UserModel.findOne({ googleId: usersub });
		const note = user?.notifications.find((notification) => {
			return notification.id == noteId;
		})
		if (!note) {
			res.statusCode = 500;
			res.send();
		}
		await NotificationModel.findByIdAndUpdate(noteId, { read: true });
		res.send();
	} catch (err) {
		res.statusCode = 500;
		res.send();
	}
};

const notificationDelete = async (req: Request, res: Response) => {
	try {
		const usersub = res.locals.usersub;
		const noteId = req.params.noteId;
		const user = await UserModel.findOneAndUpdate({ googleId: usersub }, { $pull: { notifications: { id: noteId } } });
		const note = user?.notifications.find((notification) => {
			return notification.id == noteId;
		})
		if (note) {
			console.error(note);
			res.statusCode = 500;
			res.send();
		}
		await NotificationModel.findByIdAndDelete(noteId);
		res.send();
	} catch (err) {
		res.statusCode = 500;
		res.send();
	}
};

export const notificationRouter = Router();
notificationRouter.use(authMW);

notificationRouter.put("/read/:noteId", notificationRead);
notificationRouter.delete("/delete/:noteId", notificationDelete);
