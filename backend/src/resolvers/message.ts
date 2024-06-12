import { mongoose } from "@typegoose/typegoose";
import { MessageModel, RoomModel, UserModel } from "../models/exports.js";

export const resolveMessageCreate = async (googleId: string, roomId: string, content: string) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const sender = await UserModel.findOne({ googleId: googleId });
		if (!sender) {
			throw new Error("Unable to find user");
		}
		const message = await MessageModel.create([{ sender: sender?.id, content: content }], { session });
		const room = await RoomModel.findByIdAndUpdate(roomId, { $push: { messages: message[0].id } }, { new: true, session });
		await session.commitTransaction();
		return {
			sender: sender,
			message: message[0],
			room: room
		}
	} catch (err) {
		await session.abortTransaction();
		throw err;
	} finally {
		await session.endSession();
	}
}


export const resolveMessageEdit = async (googleId: string, messageId: string, content: string) => {
	try {
		const user = await UserModel.findOne({ googleId: googleId });
		if (!user) {
			throw new Error("Unable to find user");
		}
		const message = await MessageModel.findOneAndUpdate({ _id: messageId, sender: user?.id }, { content: content, editTime: Date.now() }, { new: true });
		return message;
	} catch (err) {
		throw err;
	}
}


export const resolveMessageDelete = async (googleId: string, messageId: string) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const user = await UserModel.findOne({ googleId: googleId });
		if (!user) {
			throw new Error("Unable to find user");
		}
		const message = await MessageModel.findOneAndDelete({ _id: messageId, sender: user?.id }, { session });
		if (message) {
			console.log(message)
			await RoomModel.findOneAndUpdate({ in: { 'messages._id': messageId } }, { $pull: { messages: messageId } }, { session });
		}
		await session.commitTransaction();
		return;
	} catch (err) {
		await session.abortTransaction();
		throw err;
	} finally {
		await session.endSession();
	}
}
