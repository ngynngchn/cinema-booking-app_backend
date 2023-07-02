import { read, updateData, updateJSON } from "../utils/helper.js";

export const getReservations = (request, response) => {
	const id = request.params.id;
	read(id)
		.then((data) => response.json(data))
		.catch((err) => console.log(err));
};

export const createReservation = (request, response) => {
	const id = request.params.id;
	const data = request.body;
	updateJSON(data, id)
		.then((res) => {
			response.json(res);
		})
		.catch((err) => console.log(err));
};

export const updateReservations = (request, response) => {
	const data = request.body;
	updateData(data)
		.then((res) => response.json(res))
		.catch((err) => console.log(err));
};
