import { createMail } from "../utils/mail.js";

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
