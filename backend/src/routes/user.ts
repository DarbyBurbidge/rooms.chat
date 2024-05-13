import { Request, Response, Router } from "express";

export const userSearch = async (req: Request, res: Response) => {
	console.log(req.body);
	res.send("userSearch");
};

export const userInvite = async (req: Request, res: Response) => {
	console.log(req.body);
	res.send("userInvite");
};

export const userRouter = Router();

userRouter.get("/search", userSearch);
userRouter.put("/invite", userInvite);
