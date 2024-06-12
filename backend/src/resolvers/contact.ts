import { UserModel } from "../models/exports.js";


export const resolveContactList = async (googleId: string) => {
	try {
		const user = await UserModel.findOne({ googleId: googleId }).populate("contacts");
		console.log(user);
		return user?.contacts;
	} catch (err) {
		throw err;
	}
}


export const resolveContactAdd = async (googleId: string, userId: string) => {
	try {
		const user = await UserModel.findOneAndUpdate({ googleId: googleId }, { contacts: userId }, { new: true }).populate("contacts");
		return user?.contacts;
	} catch (err) {
		throw err;
	}
}


export const resolveContactDelete = async (googleId: string, userId: string) => {
	try {
		const user = await UserModel.findOneAndUpdate({ googleId: googleId }, { $pull: { contacts: userId } }, { new: true }).populate("contacts");
		return user?.contacts;
	} catch (err) {
		throw err;
	}
}
