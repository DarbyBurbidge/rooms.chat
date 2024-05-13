import { Request, Response, Router } from "express";
import { OAuth2Client } from "google-auth-library";

export const oauthGet = async (req: Request, res: Response) => {
	const code = req.query.code;
	console.log('code', code);
	try {
		const redirectUrl = 'http://127.0.0.1:3000/oauth';
		const oAuth2Client = new OAuth2Client(
			process.env.CLIENT_ID,
			process.env.CLIENT_SECRET,
			redirectUrl
		);
		const response = await oAuth2Client.getToken(code);
		await oAuth2Client.setCredentials(response.tokens);
		console.log('Tokens acquired');
		const user = oAuth2Client.credentials;
		console.log('credentials', user);

		const ticket = await oAuth2Client.verifyIdToken({ idToken: user.id_token, audience: process.env.CLIENT_ID });

		console.log('ticket', ticket);
		res.cookie('Bearer', user.id_token);
		res.redirect("http://localhost:5173");
	} catch (err) {
		console.error(err);
	}
};

export const oauthRouter = Router();

oauthRouter.get("/", oauthGet);
