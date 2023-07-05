import "./utils/config.js";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import multer from "multer";
import { sendMail } from "./controller/mail-controller.js";
import cookieParser from "cookie-parser";
import {
	createReservation,
	getReservations,
	updateReservations,
} from "./controller/booking-controller.js";
import {
	createScreening,
	getScreeningIDs,
} from "./controller/admin-controller.js";
import { logout, login, authenticate } from "./controller/auth-controller.js";

// create server
const server = express();
const PORT = process.env.PORT;

//* ======== BODY PARSER ========
// for formfields
const upload = multer();
// middleware: for JSON
server.use(express.json());
// for cookies
server.use(cookieParser());
// enable cross communication to frontend
server.use(
	cors({
		origin: process.env.VITE_FRONTEND,
		credentials: true,
		exposedHeaders: [
			"Cross-Origin-Opener-Policy",
			"Cross-Origin-Embedder-Policy",
		],
	})
);

//* ======== LOGGER ========
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

// get screening ids
server.get("/api/get-screenings", getScreeningIDs);

// login user with google
server.post("/api/user-info", login);

// logout user
server.post("/api/logout", logout);

// authenticate use
server.post("/api/authenticate", authenticate);

//* ======== SERVER ========
server.listen(PORT, () => console.log("I am listening to PORT:", PORT));
