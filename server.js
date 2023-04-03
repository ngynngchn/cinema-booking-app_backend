import "./config/config.js";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import multer from "multer";
import {
	createSeats,
	read,
	readData,
	updateData,
	updateJSON,
} from "./helper.js";

// create server
const server = express();
const PORT = process.env.PORT;
const upload = multer();

// enable cross communication to http://localhost:5174....
server.use(cors({ origin: "http://localhost:5173" }));
// middleware: bodyparser
server.use(express.json());
// middleware: logger
server.use(morgan("dev"));

// GET handler
server.get("/api/reservations", (request, response) => {
	readData()
		.then((data) => response.json(data))
		.catch((err) => console.log(err));
});

// POST handler
server.post("/api/newReservations", (request, response) => {
	// request.body should be an id
	const data = request.body;
	updateJSON(data)
		.then((res) => {
			response.json(res);
		})
		.catch((err) => console.log(err));
});

server.post("/api/reservationList", (request, response) => {
	// request.body should be an id
	const data = request.body;
	updateData(data)
		.then((res) => response.json(res))
		.catch((err) => console.log(err));
});

// POST handler to create hall filled with requested seats
server.post("/api/seating", upload.none(), (request, response) => {
	const data = request.body;
	createSeats(data)
		.then((updatedData) => response.json(updatedData))
		.catch((err) => console.log(err));
});

server.listen(PORT, () => console.log("I am listening to PORT:", PORT));
