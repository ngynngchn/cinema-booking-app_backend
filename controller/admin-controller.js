import { createShow } from "../utils/helper.js";

export const createScreening = (request, response) => {
	const data = request.body;
	console.log(request.body);
	console.log("Received screening info", data);
	createShow(data, `./screenings/${data.id}.json`)
		.then((updatedData) => response.json(updatedData))
		.catch((err) => console.log(err));
};
