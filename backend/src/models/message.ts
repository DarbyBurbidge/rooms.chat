import { modelOptions, prop, getModelForClass } from "@typegoose/typegoose";
import type { Ref } from "@typegoose/typegoose";
import mongoose from "mongoose";
import { User } from "./user.ts";

@modelOptions({})
export class Message {
	@prop({ auto: true })
	readonly _id: mongoose.Types.ObjectId;

	@prop({ required: true, ref: () => User })
	user?: Ref<User>;

	@prop()
	timestamp?: string;

	@prop()
	content?: string;
}

export const MessageModel = getModelForClass(Message);
