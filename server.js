import "./config/config.js";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import multer from "multer";
import nodemailer from "nodemailer";
import {
	createSeats,
	read,
	readData,
	updateData,
	updateJSON,
} from "./helper.js";

import { createMail } from "./mail.js";
// create server
const server = express();
const PORT = process.env.PORT;

// middleware: bodyparser for formfields
const upload = multer();

// enable cross communication to http://localhost:5174....
server.use(cors({ origin: "http://localhost:5174" }));
// middleware: bodyparser
server.use(express.json());
// middleware: logger
server.use(morgan("dev"));

//nodemailer
const transport = nodemailer.createTransport({
	host: process.env.NODEMAILER_HOST,
	port: process.env.NODEMAILER_PORT,
	auth: {
		user: process.env.NODEMAILER_USER,
		pass: process.env.NODEMAILER_PASS,
	},
});

//POST handler to send email
server.post("/email", (request, response) => {
	const data = request.body;

	createMail(data)
		.then((htmlContent) => {
			const message = {
				from: "cinema@server.com",
				to: "admin@server.com",
				subject: "You received a new booking",
				text: "This is the plaintext version",
				html: htmlContent,
			};

			transport.sendMail(message, (err, info) => {
				if (err) {
					console.log("An error occurred:", err);
					response.sendStatus(500);
				} else {
					console.log("Your info:", info);
					response.sendStatus(200);
				}
			});
		})
		.catch((error) => {
			console.log("An error occurred:", error);
			response.sendStatus(500);
		});
});

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
