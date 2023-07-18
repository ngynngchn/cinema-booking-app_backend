import "./utils/config.js";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import multer from "multer";
import cookieParser from "cookie-parser";
import { sendMail } from "./controller/mail-controller.js";
import {
	createReservation,
	getReservations,
	updateReservations,
} from "./controller/booking-controller.js";
import {
	createScreening,
	getScreeningIDs,
} from "./controller/admin-controller.js";
import {
	logout,
	glogin,
	login,
	register,
	admin,
	user,
} from "./controller/auth-controller.js";
import {
	authenticate,
	encryptPassword,
	validatePassword,
} from "./middleware/auth-middleware.js";

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
		origin: process.env.VITE_FRONTEND || "http://127.0.0.1:5173",
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
server.post("/api/google-login", glogin);

// regular login
server.post("/api/login", upload.none(), encryptPassword, login);

// regular sign up
server.post(
	"/api/register",
	upload.none(),
	validatePassword,
	encryptPassword,
	register
);
// logout user
server.post("/api/logout", logout);

// authenticate use
server.post("/api/admin", authenticate, admin);
server.post("/api/user", authenticate, user);

//* ======== SERVER ========
server.listen(PORT, () => console.log("I am listening to PORT:", PORT));
