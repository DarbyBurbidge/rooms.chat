import { modelOptions, prop } from "@typegoose/typegoose";
import type { Ref } from "@typegoose/typegoose";
import mongoose from "mongoose";
import { User } from "./user.ts";
import { Message } from "./message.ts";


@modelOptions({})
export class Room {
	@prop({ auto: true })
	readonly _id: mongoose.Types.ObjectId;

	@prop({ required: true, ref: () => User })
	creator: Ref<User>;

	@prop({ ref: () => User, default: [] })
	admins: [Ref<User>];

	@prop({ ref: () => User, default: [] })
	users: [Ref<User>];

	@prop({ ref: () => Message, default: true })
	messages: [Ref<Message>];

	@prop()
	inviteUrl?: string;
}
