import { modelOptions, prop } from "@typegoose/typegoose";
import type { Ref } from "@typegoose/typegoose";
import mongoose from "mongoose";
import { User } from "./user.ts";

@modelOptions({})
export class Message {
	@prop({ auto: true })
	readonly _id: mongoose.Types.ObjectId;

	@prop({ ref: () => User, nullable: true })
	sender?: Ref<User>;

	@prop({ default: Date.now })
	createTime: string;

	@prop({ nullable: true })
	editTime: string;

	@prop({ nullable: true })
	content?: string;

	@prop({ default: false })
	read: boolean;
}
