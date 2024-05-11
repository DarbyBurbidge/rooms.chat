import { NextFunction, Request, Response, Router } from "express";
import { OAuth2Client } from "google-auth-library";

const getUserData = async (access_token: any) => {
	const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token${access_token}`);

	const data = await response.json();
	console.log('data', data);
}

export const oauthPut = async (req: Request, res: Response: next: NextFunction) => {
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

export const oauthGet = async (req: Request) => {
	const code = req.query.code;
	try {
		const redirectUrl = 'http://127.0.0.1:3000/oauth';
		const oAuth2Client = new OAuth2Client(
			process.env.CLIENT_ID,
			process.env.CLIENT_SECRET,
			redirectUrl
		);
		const res = await oAuth2Client.getToken(code);
		await oAuth2Client.setCredentials(res.tokens);
		console.log('Tokens acquired');
		const user = oAuth2Client.credentials;
		console.log('credentials', user);
		await getUserData(user.access_token);
	} catch (err) {
		console.error(err);
	}
};

export const oauthRouter = Router();

oauthRouter.put("/", oauthPut);
oauthRouter.get("/", oauthGet);
