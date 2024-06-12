import { mongoose } from "@typegoose/typegoose";
import { RoomModel, UserModel } from "../models/exports.js";

export const resolveRoomCreate = async (googleId: string, roomName: string, url: string) => {
	const session = await mongoose.startSession();
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
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		await UserModel.updateMany({ rooms: roomId }, { $pull: { rooms: roomId } }, { session })
		await RoomModel.findByIdAndDelete(roomId, { session });
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
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const preRoom = await RoomModel.findOne({ inviteUrl: inviteUrl });
		const user = await UserModel.findOneAndUpdate({ googleId: googleId }, { $push: { rooms: preRoom?.id } }, { new: true, session });
		if (!user) {
			throw new Error("unable to find user");
		}
		const room = await RoomModel.findOneAndUpdate({ inviteUrl: inviteUrl }, { $push: { users: user } }, { new: true, session });
		if (!room) {
			throw new Error("unable to find room");
		}
		await session.commitTransaction();
		return room!.id;
	} catch (err) {
		await session.abortTransaction();
		throw err;
	} finally {
		await session.endSession();
	}
}


export const resolveRoomLeave = async (roomId: string, googleId: string) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const user = await UserModel.findOneAndUpdate({ googleId: googleId }, { $pull: { rooms: roomId } });
		if (!user) {
			throw new Error("unable to find user");
		}
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


export const resolveRoomList = async (googleId: string) => {
	try {
		const user = await UserModel.findOne({ googleId: googleId }).populate('rooms');
		if (!user) {
			throw new Error("unable to find user");
		}
		return user?.rooms;
	} catch (err) {
		throw err;
	}
}


export const resolveRoomInfo = async (roomId: string) => {
	try {
		const room = await RoomModel.findOne({ _id: roomId }).populate('creator').populate('admins').populate('users').populate('messages');
		if (!room) {
			throw new Error("unable to find room");
		}
		return room;
	} catch (err) {
		throw err;
	}
}


export const resolveRoomLinkInfo = async (inviteUrl: string) => {
	try {
		const room = await RoomModel.findOne({ inviteUrl: inviteUrl }).populate('creator').populate('admins').populate('users').populate('messages');
		if (!room) {
			throw new Error("unable to find room");
		}
		return room;
	} catch (err) {
		throw err;
	}
}
