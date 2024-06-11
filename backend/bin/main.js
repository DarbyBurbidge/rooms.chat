import { createServer } from "http";
import express, { json } from "express";
import cors from "cors";
import mongoose from "mongoose";
import { Server } from "socket.io";
import cookie from "cookie";
import { config } from "dotenv";
import { OAuth2Client } from "google-auth-library";
import { accountRouter } from "./routes/account.js";
import { contactRouter } from "./routes/contact.js";
import { roomRouter } from "./routes/room.js";
import { userRouter } from "./routes/user.js";
import { oauthRouter } from "./routes/oauth.js";
import { noteRouter } from "./routes/notification.js";
import { messageRouter } from "./routes/message.js";
config();
console.log(process.env.NODE_ENV);
export const app = express();
const port = 3000;
const server = createServer(app);
export const io = new Server(server);
export const db = mongoose.connection;
const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost'],
    transports: ['websocket', 'polling'],
    methods: ["GET", "PUT", "DELETE"],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.set("io", io);
app.use(cors(corsOptions));
app.use(json());
app.use("/oauth", oauthRouter);
app.use("/account", accountRouter);
app.use("/user", userRouter);
app.use("/contact", contactRouter);
app.use("/room", roomRouter);
app.use("/note", noteRouter);
app.use("/message", messageRouter);
io.on("connection", async (socket) => {
    try {
        console.log(`connected to socket ${socket.id}`);
        socket.rooms.forEach((room) => {
            console.log(`room is: ${room}`);
        });
        const cookies = cookie.parse(socket.client.request.headers.cookie);
        console.log(cookies);
        const token = decodeURI(cookies.Authorization).split(' ')[1];
        const redirectUrl = 'http://localhost:3000/oauth';
        const oAuth2Client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET, redirectUrl);
        const ticket = await oAuth2Client.verifyIdToken({ idToken: token, audience: process.env.CLIENT_ID });
        const googleId = ticket.getPayload().sub;
        socket.join(googleId);
        socket.emit("join", googleId);
    }
    catch (err) {
        console.error(err);
        socket.emit("Could not link socket to user");
    }
});
io.on("error", (err) => {
    console.error(err);
});
mongoose.connect(`${process.env.DEV_URI}`).then(() => {
    console.log("connected to Atlas");
}).catch((err) => {
    console.error(err);
});
db.on('error', async (err) => { console.error(err); });
db.once('open', async () => {
    console.log('Atlas Open');
});
db.on('disconnected', () => {
    console.log('Atlas Closed');
});
server.listen(port, () => {
    console.log(`connected on port ${port}`);
});
//# sourceMappingURL=main.js.map