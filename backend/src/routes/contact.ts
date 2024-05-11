import { Request, Response, Router } from "express";

export const contactList = async (req: Request, res: Response) => {
	console.log(req.body);
	res.send("contactList");
};

export const contactAdd = async (req: Request, res: Response) => {
	console.log(req.body);
	res.send("contactAdd");
};

export const contactDelete = async (req: Request, res: Response) => {
	console.log(req.body);
	res.send("contactDelete");
}

export const contactRouter = Router();

contactRouter.put("/add", contactAdd);
contactRouter.delete("/delete", contactDelete);
contactRouter.get("/list", contactList);
