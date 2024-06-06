import { mongoose } from "@typegoose/typegoose";
import { MessageModel, RoomModel, UserModel } from "../models/exports.ts";

export const resolveMessageCreate = async (googleId: string, roomId: string, content: string) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const sender = await UserModel.findOne({ googleId: googleId }, { session });
		const message = await MessageModel.create([{ sender: sender?.id, content: content }], { session });
		const room = await RoomModel.findByIdAndUpdate(roomId, { $push: { messages: message[0].id } }, { session });
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
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const user = await UserModel.findOne({ googleId: googleId }, { session });
		console.log(user?.id)
		const message = await MessageModel.findOneAndUpdate({ _id: messageId, sender: user?.id }, { content: content, editTime: Date.now() }, { new: true, session });
		await session.commitTransaction();
		return message;
	} catch (err) {
		await session.abortTransaction();
		throw err;
	} finally {
		await session.endSession();
	}
}


export const resolveMessageDelete = async (googleId: string, messageId: string) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const user = await UserModel.findOne({ googleId: googleId }, { session });
		const message = await MessageModel.findOneAndDelete({ _id: messageId, sender: user?.id });
		if (message) {
			await RoomModel.findOneAndUpdate({ messages: messageId });
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
