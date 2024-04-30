import * as http from "http";
import * as express from "express";
import * as cors from "cors";
import mongoose from "mongoose";
import { Server } from "socket.io";

require("dotenv").config();
console.log(process.env.ATLAS_URI)

const app = express.default();
const port = 3000;
const server = http.createServer(app);
const io = new Server(server);

const corsOptions = {
	origin: '*',
	transports: ['websocket', 'polling']
};

app.use(cors.default(corsOptions));

var db = mongoose.connection;

db.on('error', async (err) => {
	console.error(err);
});
db.once('open', async () => {
	console.log("connected to Atlas");
});

mongoose.connect(`${process.env.ATLAS_URI}`);

io.on("connection", (socket) => {

})
server.listen(port, () => {
	console.log(`connected on port ${port}`);
});

