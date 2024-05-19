import { Request, Response, NextFunction } from "express";
import { OAuth2Client } from "google-auth-library";

export const authMW = async (req: Request, res: Response, next: NextFunction) => {
	const cookie = req.headers['authorization'];
	try {
		const token = decodeURI(cookie!).split(' ')[1];
		console.log(`authToken: ${cookie}`);
		const redirectUrl = 'http://localhost:3000/oauth';
		const oAuth2Client = new OAuth2Client(
			process.env.CLIENT_ID,
			process.env.CLIENT_SECRET,
			redirectUrl
		);
		const ticket: LoginTicket = await oAuth2Client.verifyIdToken({ idToken: token, audience: process.env.CLIENT_ID });
		console.log(ticket);
		res.locals.usersub = ticket.getPayload().sub;
		next();
	} catch (err) {
		if (!cookie) {
			console.error("Missing Cookie");
		} else {
			console.error(err);
		}

		res.statusCode = 401
		res.send();
	}
}

