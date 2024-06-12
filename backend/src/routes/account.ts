import { Request, Response, Router } from "express";
import { OAuth2Client } from "google-auth-library";
import { authMW } from "../middleware/auth.js";
import { resolveAccountDelete, resolveAccountInfo } from "../resolvers/account.js";

export const accountLogin = async (req: Request, res: Response) => {
	console.log(req.body);
	res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
	res.header('Referrer-Policy', 'no-referrer-when-downgrade');

	const redirectUrl = 'http://localhost:3000/oauth';

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

export const accountDelete = async (_: Request, res: Response) => {
	try {
		const usersub = res.locals.usersub;
		await resolveAccountDelete(usersub);
		res.send();
	} catch (err) {
		res.statusCode = 500;
		res.send();
	}
};

export const accountInfo = async (_: Request, res: Response) => {
	try {
		const usersub = res.locals.usersub;
		const account = await resolveAccountInfo(usersub);
		res.send({ account });
	} catch (err) {
		res.statusCode = 500;
		res.send()
	}
};

export const accountRouter = Router();

accountRouter.post("/login", accountLogin);
accountRouter.use(authMW).delete("/delete", accountDelete);
accountRouter.use(authMW).get("/info", accountInfo);
