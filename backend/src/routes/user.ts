import { Request, Response, Router } from "express";
import { authMW } from "../middleware/auth.ts";
import { NotificationModel, RoomModel, UserModel } from "../models/exports.ts";

export const userSrchId = async (req: Request, res: Response) => {
	console.log(req.query.id);
	console.log("TEST");
	const user = await UserModel.findById(req.query.id);
	console.log(user)
	res.send(user);
}
export const userSearch = async (req: Request, res: Response) => {
	console.log(req.query.username);
	const username = req.query.username;
	const users = await UserModel.find({
		$or: [
			{
				given_name: {
					$regex: username,
					$options: "i"
				}
			}, {
				family_name: {
					$regex: username,
					$options: "i"
				}
			}
		]
	});
	console.log(users)
	res.send({ "users": users });
};

export const userInvite = async (req: Request, res: Response) => {
	try {
		const userId = req.params.userId;
		const roomId = req.params.roomId;
		const sender = await UserModel.findOne({ googleId: res.locals.usersub });
		const room = await RoomModel.findById(roomId);
		const inviteMessage = `${sender?.given_name} has invited you to chat!`;
		const notification = await NotificationModel.create({ from: sender, message: inviteMessage, type: "invite", url: room?.inviteUrl });
		const receiver = await UserModel.findByIdAndUpdate(userId, { $push: { notifications: notification } });
		res.send();
	} catch (err) {
		res.statusCode = 500;
		res.send();
	}
};

export const userRouter = Router();
userRouter.use(authMW);

userRouter.get("/id", userSrchId);
userRouter.get("/search", userSearch);
userRouter.put("/invite/:userId/:roomId", userInvite);
