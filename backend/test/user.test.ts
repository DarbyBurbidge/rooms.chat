import { connectToDB, disconnectFromDB } from "./mocks"
import { resolveUserInvite, resolveUserSrch } from "../src/resolvers/user.ts"
import { UserModel, RoomModel } from "../src/models/exports.ts";

describe("user", () => {
  beforeAll(async () => {
    await connectToDB();
  });
  afterAll(async () => {
    await disconnectFromDB();
  });

  describe("username search", () => {
    it("should return an empty list when the names are not found", async () => {
      const names = ["z"];
      const users = await resolveUserSrch(names);
      expect(users).toEqual([]);
    });

    it("should throw when names is empty", async () => {
      const names: string[] = [];
      await expect(resolveUserSrch(names)).rejects.toThrow("must be a nonempty array");
    });
    it("should return a list of users if any of the names match", async () => {
      const names1: string[] = ["darby"];
      const names2: string[] = ["norman"];
      const names3: string[] = ["b", "x"];
      const users = await UserModel.find();
      const users1 = await resolveUserSrch(names1);
      const users2 = await resolveUserSrch(names2);
      const users3 = await resolveUserSrch(names3);
      expect(users1.length).toBe(1);
      expect(users1[0].toJSON()).toEqual(users[0].toJSON());
      expect(users2.length).toBe(1);
      expect(users2[0].toJSON()).toEqual(users[1].toJSON());
      expect(users3.length).toBe(2);
      for (let i = 0; i < users3.length; i++) {
        expect(users[i].toJSON()).toEqual(users[i].toJSON());
      }
    });
  });


  describe("user invite", () => {
    it("should throw an error when userId isn't in database", async () => {
      const users = await UserModel.find();
      const rooms = await RoomModel.find();
      await expect(resolveUserInvite("1", rooms[0].id, users[0].googleId)).rejects.toThrow();
    })

    it("should throw an error when roomId isn't in database", async () => {
      const users = await UserModel.find();
      await RoomModel.find();
      await expect(resolveUserInvite(users[1].id, "1", users[0].googleId)).rejects.toThrow();
    })

    it("should throw an error when googleId isn't in database", async () => {
      const users = await UserModel.find();
      const rooms = await RoomModel.find();
      await expect(resolveUserInvite(users[1].id, rooms[0].id, "1")).rejects.toThrow();
    })

    it("should return a notification when all input is valid", async () => {
      const users = await UserModel.find();
      const rooms = await RoomModel.find();
      const notifications = await resolveUserInvite(users[1].id, rooms[0].id, users[0].googleId);
      users.forEach((user) => {
        console.log(user._id);
      })
      rooms.forEach((room) => {
        console.log(room._id);
      })
      expect(notifications).toMatchObject(expect.arrayContaining([expect.objectContaining({ from: expect.objectContaining({ _id: users[0]._id }), message: "Darby has invited you to chat!", type: "invite", url: "www.mockroom.com", read: false })]));
    })
  })
});
