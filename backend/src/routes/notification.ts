import { Request, Response, Router } from "express";

const notificationCreate = async (req: Request, res: Response) => {
	console.log(req.body);
	res.send("notificationCreate")
};

const notificationDelete = async (req: Request, res: Response) => {
	console.log(req.body);
	res.send("notificationDelete")
};

export const notificationRouter = Router();

notificationRouter.put("/create", notificationCreate);
notificationRouter.delete("/delete", notificationDelete);
