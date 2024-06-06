import { modelOptions, prop } from "@typegoose/typegoose";
import type { Ref } from "@typegoose/typegoose";
import mongoose from "mongoose";
import { Room } from "./room.ts";
import { Notification } from "./notification.ts";

@modelOptions({})
export class User {
	@prop({ auto: true })
	readonly _id: mongoose.Types.ObjectId;

	@prop({ required: true, unique: true })
	readonly googleId: string;

	@prop({ nullable: true })
	family_name?: string;

	@prop({ nullable: true })
	given_name?: string;

	@prop({ nullable: true })
	imageUrl?: string;

	@prop({ ref: Room, default: [] })
	rooms: [Ref<Room>];

	@prop({ ref: () => Notification, default: [] })
	notifications: [Ref<Notification>];

	@prop({ ref: () => User, default: [] })
	contacts: [Ref<User>];
}
