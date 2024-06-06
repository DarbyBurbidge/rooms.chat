import { Request, Response, Router } from "express";
import { authMW } from "../middleware/auth.ts";
import { NotificationModel, UserModel } from "../models/exports.ts";
import { resolveNotifiDelete, resolveNotifiRead } from "../resolvers/notification.ts";

const notificationRead = async (req: Request, res: Response) => {
	try {
		const usersub = res.locals.usersub;
		const noteId = req.params.noteId;
		const notification = await resolveNotifiRead(usersub, noteId);
		res.send(notification);
	} catch (err) {
		res.statusCode = 500;
		res.send();
	}
};

const notificationDelete = async (req: Request, res: Response) => {
	try {
		const usersub = res.locals.usersub;
		const noteId = req.params.noteId;
		await resolveNotifiDelete(usersub, noteId);
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
