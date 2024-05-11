import { Request, Response, Router } from "express";

export const roomCreate = async (req: Request, res: Response) => {
	console.log(req.body);
	res.send("roomCreate");
};

export const roomDelete = async (req: Request, res: Response) => {
	console.log(req.body);
	res.send("roomDelete");
};

export const roomList = async (req: Request, res: Response) => {
	console.log(req.body);
	res.send("roomList");
};

export const roomInfo = async (req: Request, res: Response) => {
	console.log(req.body);
	res.send("roomInfo");
};

export const roomRouter = Router();

roomRouter.put("/create", roomCreate);
roomRouter.delete("/delete", roomDelete);
roomRouter.get("/list", roomList);
roomRouter.get("/info", roomInfo);
