import { Request, Response, Router } from "express";

export const roomCreate = async (req: Request, res: Response) => {
	console.log(req.body);
	res.send("roomCreate");
};

export const roomDelete = async (req: Request, res: Response) => {
	console.log(req.body);
	res.send("roomDelete");
};

export const roomLink = async (req: Request, res: Response) => {
	console.log(req.body);
	res.send("roomLink");
};

export const roomJoin = async (req: Request, res: Response) => {
	console.log(req.body);
	res.send("roomJoin");
}

export const roomLeave = async (req: Request, res: Response) => {
	console.log(req.body);
	res.send("roomLeave");
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
roomRouter.get("/link", roomLink);
roomRouter.put("/join", roomJoin);
roomRouter.put("/leave", roomLeave);
roomRouter.get("/list", roomList);
roomRouter.get("/info", roomInfo);
