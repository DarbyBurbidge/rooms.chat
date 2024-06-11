import { mongoose } from "@typegoose/typegoose";
import { NotificationModel, UserModel } from "../models/exports.js";

export const resolveNotifiRead = async (googleId: string, noteId: string) => {
	try {
		const user = await UserModel.findOne({ googleId: googleId });
		const note = user?.notifications.filter((notification) => {
			return notification.id == noteId;
		})
		console.log(note)
		if (!note) {
			throw new Error("Unable to find notification");
		}
		const notification = await NotificationModel.findByIdAndUpdate(noteId, { read: true });
		return notification;
	} catch (err) {
		throw err;
	}
}


export const resolveNotifiDelete = async (googleId: string, noteId: string) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const user = await UserModel.findOneAndUpdate({ googleId: googleId, notifications: noteId }, { $pull: { notifications: { id: noteId } } }, { new: true, session });
		if (user) {
			const note = user?.notifications.filter((notification) => {
				return notification.id == noteId;
			})
			if (note) {
				throw new Error("Unable to delete note from user")
			}
			// Only delete notification if a user was found
			await NotificationModel.findByIdAndDelete(noteId, { session });
		}
		await session.commitTransaction();
		return;
	} catch (err) {
		await session.abortTransaction();
		throw err;
	} finally {
		session.endSession();
	}
}
