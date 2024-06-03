import { Request, Response, Router } from "express";
import { authMW } from "../middleware/auth.ts";
import { resolveUserInvite, resolveUserSrch } from "../resolvers/user.ts";
import { UserModel } from "../models/exports.ts";
import { io } from "../main.ts";

export const userSrchId = async (req: Request, res: Response) => {
	console.log(req.query.id);
	const user = await UserModel.findById(req.query.id);
	console.log(user)
	res.send(user);
}
export const userSearch = async (req: Request, res: Response) => {
	const username = req.query.username as string;
	const names = username.split(' ');
	console.log(names)
	const users = await resolveUserSrch(names);
	console.log(users)
	res.send({ "users": users });
};

export const userInvite = async (req: Request, res: Response) => {
	try {
		const receiverId = req.params.userId;
		const roomId = req.params.roomId;
		const googleId = res.locals.usersub;
		const notification = await resolveUserInvite(receiverId, roomId, googleId);
		console.error(notification)
		io.to(receiverId).emit("invite", notification);
		res.send();
	} catch (err) {
		console.error(err)
		res.statusCode = 500;
		res.send();
	}
};

export const userRouter = Router();
userRouter.use(authMW);

userRouter.get("/id", userSrchId);
userRouter.get("/search", userSearch);
userRouter.put("/invite/:userId/:roomId", userInvite);
