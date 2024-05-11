import { modelOptions, prop, getModelForClass } from "@typegoose/typegoose";
import mongoose from "mongoose";

@modelOptions({})
export class User {
	@prop({ auto: true })
	readonly _id: mongoose.Types.ObjectId;

	@prop()
	username?: string;

	@prop()
	imageUrl?: string;
}

export const UserModel = getModelForClass(User);
