import { Request, Response, Router } from "express";
import { authMW } from "../middleware/auth.ts";
import { NotificationModel, UserModel } from "../models/exports.ts";

const notificationRead = async (req: Request, res: Response) => {
	try {
		const usersub = res.locals.usersub;
		const noteId = req.params.noteId;
		const user = await UserModel.findOne({ googleId: usersub });
		const note = user?.notifications.filter((notification) => {
			return notification.id == noteId;
		})
		console.log(note)
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
		const user = await UserModel.findOneAndUpdate({ googleId: usersub, notifications: noteId }, { $pull: { notifications: { id: noteId } } });
		if (user) {
			const note = user?.notifications.filter((notification) => {
				return notification.id == noteId;
			})
			if (note) {
				console.error(note);
				res.statusCode = 500;
				res.send();
			}
			// Only delete notification if a user was found
			await NotificationModel.findByIdAndDelete(noteId);
		}
		res.send();
	} catch (err) {
		res.statusCode = 500;
		res.send();
	}
};

export const noteRouter = Router();
noteRouter.use(authMW);

noteRouter.put("/read/:noteId", notificationRead);
noteRouter.delete("/delete/:noteId", notificationDelete);
