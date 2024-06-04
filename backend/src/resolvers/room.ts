import { RoomModel, UserModel } from "../models/exports.ts";
import { db } from "../main.ts";

export const resolveRoomCreate = async (googleId: string, roomName: string, url: string) => {
	const session = await db.startSession();
	session.startTransaction();
	try {
		const user = await UserModel.findOne({
			googleId: googleId
		});
		const room = await RoomModel.create([{
			name: roomName,
			creator: user?.id,
			admins: [],
			users: [],
			messages: [],
			inviteUrl: url
		}], { session });
		await UserModel.findOneAndUpdate({
			googleId: googleId
		}, {
			$push: { rooms: room }
		}, { session });
		await session.commitTransaction();
		return room[0].id;
	} catch (err) {
		await session.abortTransaction();
		throw err;
	} finally {
		await session.endSession();
	}
}


export const resolveRoomDelete = async (roomId: string) => {
	const session = await db.startSession();
	session.startTransaction();
	try {
		await UserModel.updateMany({ rooms: roomId }, { $pull: { rooms: roomId } })
		await RoomModel.findByIdAndDelete(roomId);
		await session.commitTransaction();
		return
	} catch (err) {
		await session.abortTransaction();
	} finally {
		await session.endSession();
	}
}
