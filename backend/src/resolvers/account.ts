import { UserModel } from "../models/exports.js";

export const resolveAccountDelete = async (googleId: string) => {
	try {
		await UserModel.findOneAndDelete({ googleId: googleId });
		return;
	} catch (err) {
		throw err;
	}
}


export const resolveAccountInfo = async (googleId: string) => {
	try {
		const account = await UserModel.findOne({ googleId: googleId });
		return account;
	} catch (err) {
		throw err;
	}
}
