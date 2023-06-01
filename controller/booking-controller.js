import { readData, updateData, updateJSON } from "../utils/helper.js";

export const getReservations = (_, response) => {
	readData()
		.then((data) => response.json(data))
		.catch((err) => console.log(err));
};

export const createReservation = (request, response) => {
	// request.body should be an id
	const data = request.body;
	updateJSON(data)
		.then((res) => {
			response.json(res);
		})
		.catch((err) => console.log(err));
};

export const getNewReservations = (request, response) => {
	// request.body should be an id
	const data = request.body;
	updateData(data)
		.then((res) => response.json(res))
		.catch((err) => console.log(err));
};
