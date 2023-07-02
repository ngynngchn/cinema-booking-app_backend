import "./utils/config.js";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import multer from "multer";
import { sendMail } from "./controller/mail-controller.js";
import {
	createReservation,
	getReservations,
	updateReservations,
} from "./controller/booking-controller.js";
import { createScreening } from "./controller/admin-controller.js";

// create server
const server = express();
const PORT = process.env.PORT;

// middleware: bodyparser for formfields
const upload = multer();

// enable cross communication to frontend
server.use(cors({ origin: process.env.VITE_FRONTEND }));
// middleware: bodyparser
server.use(express.json());
// middleware: logger
server.use(morgan("dev"));

//* ======== ROUTES ========
// send confirmation email to user
server.post("/email", sendMail);

// get current reservations
server.get("/api/reservations/:id", getReservations);

// create new reservations
server.post("/api/new-reservation/:id", createReservation);

// update reservations
server.post("/api/reservation-list", updateReservations);

// add screening
server.post("/api/create-screening", upload.none(), createScreening);

//* ======== SERVER ========
server.listen(PORT, () => console.log("I am listening to PORT:", PORT));
