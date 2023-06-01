import { createSeats, createShow } from "../utils/helper.js";

export const createSeatingPlan = (request, response) => {
	const data = request.body;
	createSeats(data)
		.then((updatedData) => response.json(updatedData))
		.catch((err) => console.log(err));
};

export const createScreening = (request, response) => {
	const data = request.body;
	console.log("screen:", data);
	createShow(data, `./screenings/${data.title}.json`)
		.then((updatedData) => response.json(updatedData))
		.catch((err) => console.log(err));
};
