import { connectToDB, disconnectFromDB } from "./mocks.ts";
import { resolveMessageCreate, resolveMessageEdit, resolveMessageDelete } from "../src/resolvers/message.ts";
import { MessageModel, RoomModel, UserModel } from "../src/models/exports.ts";

describe("message", () => {
  beforeAll(async () => {
    await connectToDB();
  });
  afterAll(async () => {
    await disconnectFromDB();
  });

  describe("message create", () => {
    it("should throw if googlId is invalid", async () => {
      const rooms = await RoomModel.find();
      const googleId = "100";
      const roomId = rooms[0].id;
      const content = "mock message content";
      await expect(resolveMessageCreate(googleId, roomId, content)).rejects.toThrow();
    });

    it("should throw if roomId is invalid", async () => {
      const users = await UserModel.find();
      const googleId = users[0].googleId;
      const roomId = "100";
      const content = "mock message content";
      await expect(resolveMessageCreate(googleId, roomId, content)).rejects.toThrow();
    });

    it("should resolve if googlId and roomId is valid", async () => {
      const users = await UserModel.find();
      const rooms = await RoomModel.find();
      const googleId = users[0].googleId;
      const roomId = rooms[0].id;
      const content = "mock message content";
      await expect(resolveMessageCreate(googleId, roomId, content)).resolves.not.toThrow();
    });
  });

  describe("message edit", () => {
    it("should throw if googlId is invalid", async () => {
      const messages = await MessageModel.find();
      const googleId = "100";
      const messageId = messages[0].id;
      const content = "mock message edit content";
      await expect(resolveMessageEdit(googleId, messageId, content)).rejects.toThrow();
    });

    it("should throw if messageId is invalid", async () => {
      const users = await UserModel.find();
      const googleId = users[0].googleId;
      const messageId = "100";
      const content = "mock message edit content";
      await expect(resolveMessageCreate(googleId, messageId, content)).rejects.toThrow();
    });

    it("should resolve if googlId and messageId is valid", async () => {
      const messages = await MessageModel.find();
      const users = await UserModel.find();
      const googleId = users[0].googleId;
      const messageId = messages[0].id;
      const content = "mock message edit content";
      await expect(resolveMessageEdit(googleId, messageId, content)).resolves.not.toThrow();
    });
  });

  describe("message delete", () => {
    it("should throw if googlId is invalid", async () => {
      const messages = await MessageModel.find();
      const googleId = "100";
      const messageId = messages[0].id;
      await expect(resolveMessageDelete(googleId, messageId)).rejects.toThrow();
    });

    it("should throw if messageId is invalid", async () => {
      const users = await UserModel.find();
      const googleId = users[0].id;
      const messageId = "100";
      await expect(resolveMessageDelete(googleId, messageId)).rejects.toThrow();
    });

    it("should resolve if googlId and messageId is valid", async () => {
      const users = await UserModel.find();
      const messages = await MessageModel.find();
      const googleId = users[0].googleId;
      const messageId = messages[0].id;
      await expect(resolveMessageDelete(googleId, messageId)).resolves.not.toThrow();
    });

  });
});
