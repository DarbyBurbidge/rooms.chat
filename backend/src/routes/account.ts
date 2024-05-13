import { Request, Response, Router } from "express";
import { OAuth2Client } from "google-auth-library";

export const accountLogin = async (req: Request, res: Response) => {
	console.log(req.body);
	res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
	res.header('Referrer-Policy', 'no-referrer-when-downgrade');

	const redirectUrl = 'http://127.0.0.1:3000/oauth';

	const oAuth2Client = new OAuth2Client(
		process.env.CLIENT_ID,
		process.env.CLIENT_SECRET,
		redirectUrl
	);

	const authorizeUrl = oAuth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: 'https://www.googleapis.com/auth/userinfo.profile openid',
		prompt: 'consent'
	});

	res.json({ url: authorizeUrl });
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
