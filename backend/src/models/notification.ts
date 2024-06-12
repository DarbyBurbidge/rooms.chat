import { modelOptions, prop } from "@typegoose/typegoose";
import type { Ref } from "@typegoose/typegoose";
import mongoose from "mongoose";
import { User } from "./user.js";

@modelOptions({})
export class Notification {
	@prop({ auto: true })
	_id: mongoose.Types.ObjectId;

	@prop({ ref: () => User, nullable: true })
	from?: Ref<User>;

	@prop({ required: true })
	message: string;

	@prop({ required: true })
	type: string;

	@prop({ required: true })
	url: string;

	@prop({ default: false })
	read: boolean;
}

