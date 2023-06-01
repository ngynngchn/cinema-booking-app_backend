import { createMail } from "../utils/mail.js";
import nodemailer from "nodemailer";

//nodemailer
const transport = nodemailer.createTransport({
	host: process.env.NODEMAILER_HOST,
	port: process.env.NODEMAILER_PORT,
	auth: {
		user: process.env.NODEMAILER_USER,
		pass: process.env.NODEMAILER_PASS,
	},
});

export const sendMail = (request, response) => {
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
};
