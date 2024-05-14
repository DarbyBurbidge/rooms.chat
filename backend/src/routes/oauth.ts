import { Request, Response, Router } from "express";
import { OAuth2Client } from "google-auth-library";
import { UserModel } from "../models/exports.ts";

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
		const userCred = oAuth2Client.credentials;
		console.log('credentials', userCred);

		const ticket: LoginTicket = await oAuth2Client.verifyIdToken({ idToken: userCred.id_token, audience: process.env.CLIENT_ID });
		const payload = ticket.getPayload();
		console.log(ticket);

		let user = await UserModel.findOne({ googleId: payload.sub });
		if (!user) {
			user = await UserModel.create({ googleId: payload.sub, family_name: payload.family_name, given_name: payload.given_name, imageUrl: payload.picture });
			console.log('user added:', user);
		}
		console.log('user found', user);
		res.cookie('Bearer', userCred.id_token);
		res.redirect("http://localhost:5173");
	} catch (err) {
		console.error(err);
	}
};

export const oauthRouter = Router();

oauthRouter.get("/", oauthGet);
