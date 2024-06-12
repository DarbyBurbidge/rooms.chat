import { mongoose } from "@typegoose/typegoose";
import { NotificationModel, RoomModel, UserModel } from "../models/exports.js";

export const resolveUserSrch = async (names: string[]) => {
	try {
		const users = await UserModel.find({
			$or: [
				{
					$or: names.map((name) => {
						return {
							given_name: {
								$regex: name,
								$options: "i"
							}
						}
					})
				}, {
					$or: names.map((name) => {
						return {
							family_name: {
								$regex: name,
								$options: "i"
							}
						}
					})
				}
			]
		});
		return users;
	} catch (err) {
		throw err;
	}
}

export const resolveUserInvite = async (userId: string, roomId: string, googleId: string) => {
	const session = await mongoose.startSession();
	try {
		const sender = await UserModel.findOne({ googleId: googleId });
		if (!sender) {
			throw new Error("Could not find user");
		}
		const room = await RoomModel.findById(roomId);
		console.log(userId, roomId, googleId)
		const inviteMessage = `${sender?.given_name} has invited you to chat!`;
		session.startTransaction();
		const notification = await NotificationModel.create([{
			from: sender,
			message: inviteMessage,
			type: "invite",
			url: room?.inviteUrl
		}], {
			session: session
		});
		await UserModel.findByIdAndUpdate(userId, { $push: { notifications: notification } }, { new: true, session });
		await session.commitTransaction();
		return notification;
	} catch (err) {
		await session.abortTransaction();
		throw err;
	}
	finally {
		session.endSession();
	}
}
