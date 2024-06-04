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
		throw err;
	} finally {
		await session.endSession();
	}
}


export const resolveRoomLink = async (roomId: string) => {
	try {
		const room = await RoomModel.findById(roomId);
		return room?.inviteUrl;
	} catch (err) {
		throw err;
	}
}


export const resolveRoomJoin = async (inviteUrl: string, googleId: string) => {
	const session = await db.startSession();
	session.startTransaction();
	try {
		const preRoom = await RoomModel.findOne({ inviteUrl: inviteUrl });
		const user = await UserModel.findOneAndUpdate({ googleId: googleId }, { $push: { rooms: preRoom?.id } });
		const room = await RoomModel.findOneAndUpdate({ inviteUrl: inviteUrl }, { $push: { users: user } });
		await session.commitTransaction();
		return room?.id;
	} catch (err) {
		await session.abortTransaction();
		throw err;
	} finally {
		await session.endSession();
	}
}


export const resolveRoomLeave = async (roomId: string, googleId: string) => {
	const session = await db.startSession();
	session.startTransaction();
	try {
		const user = await UserModel.findOneAndUpdate({ googleId: googleId }, { $pull: { rooms: roomId } });
		let room = await RoomModel.findById(roomId);
		if (room?.creator.equals(user?.id)) {
			await resolveRoomDelete(roomId);
		} else if (room?.admins.includes(user?.id)) {
			room = await RoomModel.findByIdAndUpdate(roomId, { $pull: { users: user?.id } });
		} else {
			room = await RoomModel.findByIdAndUpdate(roomId, { $pull: { users: user?.id } });
		}
		await session.commitTransaction();
		return room;
	} catch (err) {
		await session.abortTransaction();
		throw err;
	} finally {
		await session.endSession();
	}
}

