import { modelOptions, prop, getModelForClass } from "@typegoose/typegoose";
import type { Ref } from "@typegoose/typegoose";
import mongoose from "mongoose";
import { User } from "./user.ts";
import { Message } from "./message.ts";


@modelOptions({})
export class Room {
	@prop({ auto: true })
	readonly _id: mongoose.Types.ObjectId;

	@prop({ ref: () => User })
	creator?: Ref<User>;

	@prop({ ref: () => Message })
	messages?: [Ref<Message>];
}

export const RoomModel = getModelForClass(Room);
