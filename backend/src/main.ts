import { createServer } from "http";
import express, { json } from "express";
import cors from "cors";
import mongoose from "mongoose"
import { Server } from "socket.io";
import { config } from "dotenv";
import { OAuth2Client, LoginTicket } from "google-auth-library";
import { accountRouter } from "./routes/account.ts";
import { contactRouter } from "./routes/contact.ts";
import { roomRouter } from "./routes/room.ts";
import { userRouter } from "./routes/user.ts";
import { oauthRouter } from "./routes/oauth.ts";
import { noteRouter } from "./routes/notification.ts";
import { messageRouter } from "./routes/message.ts";

config();

export const app = express();
const port = 3000;
const server = createServer(app);
export const io = new Server(server);
const db = mongoose.connection;
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
// account
app.use("/account", accountRouter);
// user
app.use("/user", userRouter);
// contact
app.use("/contact", contactRouter);
// room
app.use("/room", roomRouter);
// notification
app.use("/note", noteRouter);
// message
app.use("/message", messageRouter);

io.on("connection", async (socket) => {
	try {
		console.log(`connected to socket ${socket.id}`);
		socket.rooms.forEach((room) => {
			console.log(`room is: ${room}`);
		});
		const cookie = socket.client.request.headers.cookie;
		console.log(cookie)
		const token = decodeURI(cookie!).split('Authorization=Bearer ')[1];
		console.log(`authToken: ${cookie}`);
		const redirectUrl = 'http://localhost:3000/oauth';
		const oAuth2Client = new OAuth2Client(
			process.env.CLIENT_ID,
			process.env.CLIENT_SECRET,
			redirectUrl
		);
		const ticket: LoginTicket = await oAuth2Client.verifyIdToken({ idToken: token, audience: process.env.CLIENT_ID });
		console.log(ticket);
		socket.join(ticket.getPayload()!.sub);
	} catch (err) {
		console.error(err)
		socket.emit("Could not link socket to user")
	}
});
io.on("error", (err) => {
	console.error(err);
});

mongoose.connect(`${process.env.ATLAS_URI}`).then(() => {
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
