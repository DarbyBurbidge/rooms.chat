import { createServer } from "http";
import express, { json } from "express";
import cors from "cors";
import mongoose from "mongoose"
import { Server } from "socket.io";
import cookie from "cookie";
import { config } from "dotenv";
import { OAuth2Client, LoginTicket } from "google-auth-library";
import { accountRouter } from "./routes/account.js";
import { contactRouter } from "./routes/contact.js";
import { roomRouter } from "./routes/room.js";
import { userRouter } from "./routes/user.js";
import { oauthRouter } from "./routes/oauth.js";
import { noteRouter } from "./routes/notification.js";
import { messageRouter } from "./routes/message.js";
import { UserModel } from "./models/exports.js";

config();

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
		const cookies = cookie.parse(socket.client.request.headers.cookie!);
		console.log(cookies)
		const token = decodeURI(cookies.Authorization).split(' ')[1]!
		const oAuth2Client = new OAuth2Client(
			process.env.CLIENT_ID,
			process.env.CLIENT_SECRET,
			process.env.OAUTH_REDIRECT_URL
		);
		const ticket: LoginTicket = await oAuth2Client.verifyIdToken({ idToken: token, audience: process.env.CLIENT_ID });
		const googleId = ticket.getPayload()!.sub;
		// NOTE: this is the users googleId
		// add user to personal room
		socket.join(googleId);
		socket.emit("join", googleId);
		// add user to all their rooms
		const user = await UserModel.findOne({ googleId: googleId });
		user?.rooms.forEach((room) => {
			socket.join(room.toString());
			socket.emit("join", room.toString());
			console.log(`joined room: ${room.toString()}`);
		});
	} catch (err) {
		console.error(err)
		socket.emit("Could not link socket to user")
	}
});
io.on("error", (err) => {
	console.error(err);
});

mongoose.connect(`${process.env.NODE_ENV == "prod" ? process.env.PROD_URI : process.env.DEV_URI}`).then(() => {
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
