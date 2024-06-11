import { getModelForClass } from "@typegoose/typegoose";
import { Message } from "./message.js";
import { Room } from "./room.js";
import { User } from "./user.js";
import { Notification } from "./notification.js";

/* This file exists to fix curcular dependencies in the models
 */

export const MessageModel = getModelForClass(Message);
export const UserModel = getModelForClass(User);
export const RoomModel = getModelForClass(Room);
export const NotificationModel = getModelForClass(Notification);
