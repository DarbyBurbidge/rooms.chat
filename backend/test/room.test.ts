import { connectToDB, disconnectFromDB } from "./mocks.ts";
import { resolveRoomCreate, resolveRoomDelete, resolveRoomLink, resolveRoomJoin, resolveRoomLeave, resolveRoomList, resolveRoomInfo, resolveRoomLinkInfo } from "../src/resolvers/room.ts";
import { RoomModel, UserModel } from "../src/models/exports.ts";


describe("room", () => {
  beforeAll(async () => {
    await connectToDB();
  });
  afterAll(async () => {
    await disconnectFromDB();
  });

  describe("room create", () => {

    it("should throw if googleId is invalid", async () => {
      const googleId = '100'
      const url = "www.mocktest.com";
      const roomName = "mock room";
      await expect(resolveRoomCreate(googleId, roomName, url)).rejects.toThrow();
    });

    it("should succeed if googleId is valid", async () => {
      const googleId = '001'
      const url = "www.mocktest.com";
      const roomName = "mock room";
      await expect(resolveRoomCreate(googleId, roomName, url)).resolves.not.toThrow();
    });
  });

  describe("room link", () => {
    it("should throw if roomId is invalid", async () => {
      const roomId = "001";
      await expect(resolveRoomLink(roomId)).rejects.toThrow();
    });
    it("should return room url if roomId is valid", async () => {
      const rooms = await RoomModel.find();
      const roomId = rooms[0].id
      await expect(resolveRoomLink(roomId)).resolves.toBe(rooms[0].inviteUrl);
    });
  });

  describe("room join", () => {
    it("should throw if inviteUrl is invalid", async () => {
      const users = await UserModel.find();
      const googleId = users[0].googleId;
      const inviteUrl = "www.invalidurl.com";
      await expect(resolveRoomJoin(inviteUrl, googleId)).rejects.toThrow("unable to find room");
    });
    it("should throw if googleId is invalid", async () => {
      const rooms = await RoomModel.find();
      const googleId = "100";
      const inviteUrl = rooms[0].inviteUrl!;
      await expect(resolveRoomJoin(inviteUrl, googleId)).rejects.toThrow("unable to find user");
    });
    it("should resolve if inviteUrl and googleId is valid", async () => {
      const users = await UserModel.find();
      const rooms = await RoomModel.find();
      const googleId = users[0].googleId;
      const inviteUrl = rooms[0].inviteUrl!;
      await expect(resolveRoomJoin(inviteUrl, googleId)).resolves.toBe(rooms[0].id);
    });
  });

  describe("room leave", () => {
    it("should throw if roomId is invalid", async () => {
      const users = await UserModel.find();
      const googleId = users[0].googleId;
      const roomId = "100";
      await expect(resolveRoomLeave(roomId, googleId)).rejects.toThrow();
    });
    it("should throw if googleId is invalid", async () => {
      const rooms = await RoomModel.find();
      const googleId = "100";
      const roomId = rooms[0].id.toString();
      await expect(resolveRoomLeave(roomId, googleId)).rejects.toThrow("unable to find user");
    });
    it("should resolve if roomId and googleId is valid", async () => {
      const users = await UserModel.find();
      const rooms = await RoomModel.find();
      const googleId = users[0].googleId;
      const roomId = rooms[0].id.toString();
      await expect(resolveRoomLeave(roomId, googleId)).resolves.toMatchObject(
        expect.objectContaining({ id: rooms[0].id.toString(), inviteUrl: rooms[0].inviteUrl })
      );
    });
  });

  describe("room list", () => {
    it("should throw if googleId is invalid", async () => {
      const googleId = "100";
      await expect(resolveRoomList(googleId)).rejects.toThrow();
    });
    it("should resolve if googleId is valid", async () => {
      const users = await UserModel.find();
      const googleId = users[0].googleId;
      await expect(resolveRoomList(googleId)).resolves.not.toThrow();
    });
  });

  describe("room info", () => {
    it("should throw if googleId is invalid", async () => {
      const roomId = "100";
      await expect(resolveRoomInfo(roomId)).rejects.toThrow();
    });
    it("should resolve if googleId is valid", async () => {
      const rooms = await RoomModel.find();
      const roomId = rooms[0].id.toString();
      await expect(resolveRoomInfo(roomId)).resolves.not.toThrow();
    });
  });

  describe("room link info", () => {
    it("should throw if googleId is invalid", async () => {
      const inviteLink = "100";
      await expect(resolveRoomLinkInfo(inviteLink)).rejects.toThrow();
    });
    it("should resolve if googleId is valid", async () => {
      const rooms = await RoomModel.find();
      const inviteLink = rooms[0].inviteUrl!;
      await expect(resolveRoomLinkInfo(inviteLink)).resolves.not.toThrow();
    });
  });

  describe("room delete", () => {
    it("should throw if roomId is invalid", async () => {
      const roomId = "001";
      await expect(resolveRoomDelete(roomId)).rejects.toThrow();

    });
    it("should succeed if roomId is valid", async () => {
      const rooms = await RoomModel.find();
      const roomId = rooms[0].id;
      await expect(resolveRoomDelete(roomId)).resolves.not.toThrow();
    });
  });
});
