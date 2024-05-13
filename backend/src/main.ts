import { createServer } from "http";
import express from "express";
import cors from "cors";
import mongoose from "mongoose"
import { Server } from "socket.io";
import { config } from "dotenv";
import { accountRouter } from "./routes/account.ts";
import { contactRouter } from "./routes/contact.ts";
import { roomRouter } from "./routes/room.ts";
import { userRouter } from "./routes/user.ts";
import { oauthRouter } from "./routes/oauth.ts";

config();

export const app = express();
const port = 3000;
const server = createServer(app);
const io = new Server(server);
const db = mongoose.connection;
const corsOptions = {
	origin: ['http://localhost:5173', 'http://localhost'],
	transports: ['websocket', 'polling'],
	methods: ["GET", "PUT", "DELETE"],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true
};

app.use(cors(corsOptions));
app.use("/oauth", oauthRouter);
// account
app.use("/account", accountRouter);
// user
app.use("/user", userRouter);
// contact
app.use("/contact", contactRouter);
// room
app.use("/room", roomRouter);


io.on("connection", (socket) => {
	console.log(`connected to socket ${socket}`);
});
io.on("error", (err) => {
	console.error(err);
});

mongoose.connect(`${process.env.ATLAS_URI}`);
db.on('error', console.error.bind(console, 'Connection Error'));
db.once('open', async () => {
	console.log("connected to Atlas");
});

server.listen(port, () => {
	console.log(`connected on port ${port}`);
});
