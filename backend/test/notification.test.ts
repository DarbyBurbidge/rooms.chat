import { connectToDB, disconnectFromDB } from "./mocks.ts";
import { resolveNotifiRead, resolveNotifiDelete } from "../src/resolvers/notification.ts";
import { MessageModel, RoomModel, UserModel } from "../src/models/exports.ts";

describe("notification", () => {
  beforeAll(async () => {
    await connectToDB();
  });
  afterAll(async () => {
    await disconnectFromDB();
  });

  describe("notification read", () => {
    it("should throw if googlId is invalid", async () => {
      const messages = await MessageModel.find();
      const googleId = "100";
      const messageId = messages[0].id;
      const content = "mock message edit content";
      await expect(resolveNotifiRead(googleId, messageId, content)).rejects.toThrow();
    });

    it("should throw if messageId is invalid", async () => {
      const users = await UserModel.find();
      const googleId = users[0].googleId;
      const messageId = "100";
      const content = "mock message edit content";
      await expect(resolveNotifiRead(googleId, messageId, content)).rejects.toThrow();
    });

    it("should resolve if googlId and messageId is valid", async () => {
      const messages = await MessageModel.find();
      const users = await UserModel.find();
      const googleId = users[0].googleId;
      const messageId = messages[0].id;
      const content = "mock message edit content";
      await expect(resolveNotifiRead(googleId, messageId, content)).resolves.not.toThrow();
    });
  });

  describe("notification delete", () => {
    it("should throw if googlId is invalid", async () => {
      const messages = await MessageModel.find();
      const googleId = "100";
      const messageId = messages[0].id;
      await expect(resolveNotifiDelete(googleId, messageId)).rejects.toThrow();
    });

    it("should throw if messageId is invalid", async () => {
      const users = await UserModel.find();
      const googleId = users[0].id;
      const messageId = "100";
      await expect(resolveNotifiDelete(googleId, messageId)).rejects.toThrow();
    });

    it("should resolve if googlId and messageId is valid", async () => {
      const users = await UserModel.find();
      const messages = await MessageModel.find();
      const googleId = users[0].googleId;
      const messageId = messages[0].id;
      await expect(resolveNotifiDelete(googleId, messageId)).resolves.not.toThrow();
    });
  });
});
