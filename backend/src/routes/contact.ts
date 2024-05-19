import { Request, Response, Router } from "express";
import { authMW } from "../middleware/auth.ts";
import { UserModel } from "../models/exports.ts";

export const contactList = async (req: Request, res: Response) => {
	try {
		const usersub = res.locals.usersub;
		const user = await UserModel.findOne({ googleId: usersub })
		res.send({
			contacts: user?.contacts
		})
	} catch (err) {
		res.statusCode = 500;
		res.send();
	}
};

export const contactAdd = async (req: Request, res: Response) => {
	try {
		const usersub = res.locals.usersub;
		const userId = req.params.userId;
		const user = await UserModel.findOneAndUpdate({ googleId: usersub }, { contacts: userId })
		res.send({
			contacts: user?.contacts
		})
	} catch (err) {
		res.statusCode = 500;
		res.send();
	}
};

export const contactDelete = async (req: Request, res: Response) => {
	try {
		const usersub = res.locals.usersub;
		const userId = req.params.userId;
		const user = await UserModel.findOneAndUpdate({ googleId: usersub }, { $pull: { contacts: userId } });
		res.send({
			contacts: user?.contacts
		})
	} catch (err) {
		res.statusCode = 500;
		res.send();
	}
}

export const contactRouter = Router();
contactRouter.use(authMW);

contactRouter.put("/add/:userId", contactAdd);
contactRouter.delete("/delete/:userId", contactDelete);
contactRouter.get("/list", contactList);
