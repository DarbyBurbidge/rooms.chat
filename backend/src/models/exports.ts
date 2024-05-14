import { getModelForClass } from "@typegoose/typegoose";
import { Message } from "./message.ts";
import { Room } from "./room.ts";
import { User } from "./user.ts";
import { Notification } from "./notification.ts";

/* This file exists to fix curcular dependencies in the models
 */

export const MessageModel = getModelForClass(Message);
export const UserModel = getModelForClass(User);
export const RoomModel = getModelForClass(Room);
export const NotificationModel = getModelForClass(Notification);
