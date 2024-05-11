import { Request, Response, Router } from "express";

export const accountLogin = async (req: Request, res: Response) => {
	console.log(req.body);
	res.send("accountLogin");
};

export const accountDelete = async (req: Request, res: Response) => {
	console.log(req.body);
	res.send("accountDelete");
};

export const accountInfo = async (req: Request, res: Response) => {
	console.log(req.body);
	res.send("accountInfo");
};

export const accountRouter = Router();

accountRouter.put("/login", accountLogin);
accountRouter.delete("/delete", accountDelete);
accountRouter.get("/info", accountInfo);
