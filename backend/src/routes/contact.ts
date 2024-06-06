import { Request, Response, Router } from "express";
import { authMW } from "../middleware/auth.ts";
import { UserModel } from "../models/exports.ts";
import { resolveContactAdd, resolveContactDelete, resolveContactList } from "../resolvers/contact.ts";

export const contactList = async (_: Request, res: Response) => {
	try {
		const usersub = res.locals.usersub;
		const contacts = resolveContactList(usersub);
		res.send(contacts);
	} catch (err) {
		res.statusCode = 500;
		res.send();
	}
};

export const contactAdd = async (req: Request, res: Response) => {
	try {
		const usersub = res.locals.usersub;
		const userId = req.params.userId;
		const contacts = await resolveContactAdd(usersub, userId);
		res.send(contacts);
	} catch (err) {
		res.statusCode = 500;
		res.send();
	}
};

export const contactDelete = async (req: Request, res: Response) => {
	try {
		const usersub = res.locals.usersub;
		const userId = req.params.userId;
		const contacts = await resolveContactDelete(usersub, userId);
		res.send(contacts);
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
