import { NotificationModel, RoomModel, UserModel } from "../models/exports.ts";
import { db } from "../main.ts";

export const resolveUserSrch = async (names: string[]) => {
	console.log(names)
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
}

export const resolveUserInvite = async (userId: string, roomId: string, googleId: string) => {
	const session = await db.startSession();
	session.startTransaction();
	let notification;
	try {
		const sender = await UserModel.findOne({ googleId: googleId });
		const room = await RoomModel.findById(roomId);
		console.log(userId, roomId, googleId)
		const inviteMessage = `${sender?.given_name} has invited you to chat!`;
		notification = await NotificationModel.create([{
			from: sender,
			message: inviteMessage,
			type: "invite",
			url: room?.inviteUrl
		}], {
			session: session
		});
		console.log(notification)
		await UserModel.findByIdAndUpdate(userId, { $push: { notifications: notification } }, { session });
		await session.commitTransaction();
		return notification;
	} catch (err) {
		console.error("Could not resolve user invite");
		await session.abortTransaction();
		throw err;
	}
	finally {
		session.endSession();
	}
}
