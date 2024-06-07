import mongoose from "mongoose";
import { RoomModel, UserModel, NotificationModel, MessageModel } from "../src/models/exports";
import { config } from "dotenv";

export const connectToDB = async () => {
  config();
  const db = mongoose.connection;
  await mongoose.connect(`${process.env.TEST_URI}`).then(() => {
    console.log("connected to Mock");
  }).catch((err) => {
    console.error(err);
  });
  db.on('error', async (err) => { console.error(err); });
  db.once('open', async () => {
    console.log('Mock Open');
  });
  db.on('disconnected', () => {
    console.log('Mock Closed');
  });
  const users = await mockUsers();
  await mockRoom(users[0].id);
}


export const disconnectFromDB = async () => {
  await deleteMocks();
  await mongoose.disconnect();
  await mongoose.connection.close();
}


export const mockUsers = async () => {
  const users = await UserModel.create([{ given_name: "Darby", family_name: "Burbidge", googleId: "001" }, { given_name: "Max", family_name: "Norman", googleId: "002" }]);
  users.forEach((user) => {
    console.log(user._id)
  })
  return users;
}

export const mockRoom = async (userId: string) => {
  const room = await RoomModel.create([{ name: "mock_room", creator: userId, inviteUrl: "www.mockroom.com", messages: [] }]);
  return room;
}


export const deleteMocks = async () => {
  await UserModel.collection.drop();
  await RoomModel.collection.drop();
  await MessageModel.collection.drop();
  await NotificationModel.collection.drop();
}
