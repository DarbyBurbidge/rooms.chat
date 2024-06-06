import { MongoMemoryReplSet } from "mongodb-memory-server";
import mongoose from "mongoose";
import { RoomModel, UserModel } from "../src/models/exports";


export const connectToDB = async () => {
  const db = mongoose.connection;
  const mongoServer = await MongoMemoryReplSet.create();
  await mongoose.connect(`${mongoServer.getUri()}`).then(() => {
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
}


export const disconnectFromDB = async () => {
  mongoose.connection.dropDatabase();
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
